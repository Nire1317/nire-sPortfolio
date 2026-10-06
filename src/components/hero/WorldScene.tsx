import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/*
 * "World of Innovation" hero scene.
 * Loaded lazily by HeroWorld, so three / R3F never land in the main bundle.
 * Everything is unlit (basic / line / point materials) to keep it cheap on mobile GPUs.
 */

export type WorldPalette = {
  primary: string;
  secondary: string;
  ink: string;
  bg: string;
  light: boolean;
};

export type WorldProject = {
  title: string;
  tag: string;
  themeColor: string;
  isLive: boolean;
};

export type PointerRef = MutableRefObject<{ x: number; y: number }>;

type SceneProps = {
  palette: WorldPalette;
  projects: WorldProject[];
  animate: boolean;
  compact: boolean;
  running: boolean;
  entering: boolean;
  pointer: PointerRef;
  onEntered: () => void;
  onSelectProject: (title: string) => void;
  onContextLost: () => void;
  onCreated: () => void;
};

const GLOBE_R = 1.6;
const TECH = [
  "React",
  "TypeScript",
  "Node.js",
  "Supabase",
  "Firebase",
  "Tailwind CSS",
  "Docker",
  "Claude Code",
];
const FLOW = ["Code", "Ideas", "AI", "Innovation", "Products"];
const CODE_SNIPPETS = [
  "const idea = await think();",
  "ship(product, { users })",
  "model.generate(prompt)",
  "git push origin main",
  "<World of='innovation' />",
];

// Deterministic RNG so the world looks the same on every visit
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- Canvas textures ---------- */

let dotTexture: THREE.Texture | null = null;
function getDotTexture() {
  if (dotTexture) return dotTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.85)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  dotTexture = new THREE.CanvasTexture(c);
  return dotTexture;
}

function textTexture(text: string, color: string, font: string, px = 48) {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  ctx.font = `${font.replace("{px}", String(px))}`;
  const w = Math.ceil(ctx.measureText(text).width) + px;
  const h = Math.ceil(px * 1.6);
  c.width = w;
  c.height = h;
  ctx.font = `${font.replace("{px}", String(px))}`;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.fillText(text, px / 2, h / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { tex, aspect: w / h };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function projectCardTexture(p: WorldProject, palette: WorldPalette) {
  const W = 512;
  const H = 300;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  roundRect(ctx, 4, 4, W - 8, H - 8, 28);
  ctx.fillStyle = palette.light ? "rgba(255,255,255,0.88)" : "rgba(12,14,24,0.82)";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = p.themeColor + "aa";
  ctx.stroke();
  // accent bar
  ctx.fillStyle = p.themeColor;
  roundRect(ctx, 36, 40, 56, 8, 4);
  ctx.fill();
  ctx.fillStyle = palette.ink;
  ctx.font = "700 50px Rajdhani, 'JetBrains Mono', sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(p.title, 36, 128);
  ctx.globalAlpha = 0.65;
  ctx.font = "500 24px 'JetBrains Mono', monospace";
  ctx.fillText(p.tag, 36, 170);
  ctx.globalAlpha = 1;
  if (p.isLive) {
    ctx.fillStyle = "#34d399";
    ctx.beginPath();
    ctx.arc(44, 236, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "600 22px 'JetBrains Mono', monospace";
    ctx.fillText("LIVE", 60, 244);
  }
  ctx.fillStyle = p.themeColor;
  ctx.font = "600 22px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";
  ctx.fillText("view project →", W - 36, 244);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (!fonts) {
      setReady(true);
      return;
    }
    fonts.ready.then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}

function setCursor(pointer: boolean) {
  document.body.style.cursor = pointer ? "pointer" : "";
}

/* ---------- Globe ---------- */

function Globe({
  palette,
  animate,
  compact,
}: {
  palette: WorldPalette;
  animate: boolean;
  compact: boolean;
}) {
  const spin = useRef<THREE.Group>(null);

  const { land, sea } = useMemo(() => {
    const n = compact ? 1400 : 2400;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const landPts: number[] = [];
    const seaPts: number[] = [];
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      const x = Math.cos(th) * r;
      const z = Math.sin(th) * r;
      // cheap layered sines give continent-like patches
      const f =
        Math.sin(2.3 * x + 1.1) * Math.sin(2.9 * y + 0.4) * Math.sin(2.1 * z + 2.2) +
        0.45 * Math.sin(5.1 * x + 0.3) * Math.sin(4.7 * z + 1.7) +
        0.25 * Math.sin(8.3 * y + 2.9);
      (f > 0.08 ? landPts : seaPts).push(x * GLOBE_R, y * GLOBE_R, z * GLOBE_R);
    }
    return { land: new Float32Array(landPts), sea: new Float32Array(seaPts) };
  }, [compact]);

  const grid = useMemo(() => {
    const pts: number[] = [];
    const R = GLOBE_R * 1.002;
    const seg = 96;
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = THREE.MathUtils.degToRad(lat);
      const rr = Math.cos(phi) * R;
      const yy = Math.sin(phi) * R;
      for (let i = 0; i < seg; i++) {
        const a0 = (i / seg) * Math.PI * 2;
        const a1 = ((i + 1) / seg) * Math.PI * 2;
        pts.push(
          Math.cos(a0) * rr,
          yy,
          Math.sin(a0) * rr,
          Math.cos(a1) * rr,
          yy,
          Math.sin(a1) * rr,
        );
      }
    }
    for (let lon = 0; lon < 180; lon += 30) {
      const th = THREE.MathUtils.degToRad(lon);
      for (let i = 0; i < seg; i++) {
        const a0 = (i / seg) * Math.PI * 2;
        const a1 = ((i + 1) / seg) * Math.PI * 2;
        pts.push(
          Math.cos(a0) * Math.cos(th) * R,
          Math.sin(a0) * R,
          Math.cos(a0) * Math.sin(th) * R,
          Math.cos(a1) * Math.cos(th) * R,
          Math.sin(a1) * R,
          Math.cos(a1) * Math.sin(th) * R,
        );
      }
    }
    return new Float32Array(pts);
  }, []);

  const atmosphere = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(palette.primary) },
          uIntensity: { value: palette.light ? 0.22 : 0.4 },
        },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uIntensity;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            float f = pow(1.0 - abs(dot(vNormal, vView)), 3.0);
            gl_FragColor = vec4(uColor, f * uIntensity);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: palette.light ? THREE.NormalBlending : THREE.AdditiveBlending,
      }),
    [palette],
  );
  useEffect(() => () => atmosphere.dispose(), [atmosphere]);

  useFrame((_, dt) => {
    if (animate && spin.current) spin.current.rotation.y += dt * 0.045;
  });

  const blending = palette.light ? THREE.NormalBlending : THREE.AdditiveBlending;

  return (
    <group rotation={[0.18, 0, -0.12]}>
      {/* Solid core hides the far hemisphere so the dots read as a globe */}
      <mesh renderOrder={-1}>
        <sphereGeometry args={[GLOBE_R * 0.985, 48, 48]} />
        <meshBasicMaterial color={palette.bg} />
      </mesh>
      <group ref={spin}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[land, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.095}
            map={getDotTexture()}
            color={palette.primary}
            transparent
            opacity={palette.light ? 0.75 : 0.85}
            depthWrite={false}
            blending={blending}
          />
        </points>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[sea, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.065}
            map={getDotTexture()}
            color={palette.secondary}
            transparent
            opacity={0.35}
            depthWrite={false}
            blending={blending}
          />
        </points>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[grid, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color={palette.secondary}
            transparent
            opacity={palette.light ? 0.16 : 0.1}
            depthWrite={false}
          />
        </lineSegments>
      </group>
      <mesh material={atmosphere} scale={1.1}>
        <sphereGeometry args={[GLOBE_R, 48, 48]} />
      </mesh>
    </group>
  );
}

/* ---------- Orbits ---------- */

function Orbit({
  radius,
  tilt,
  speed,
  palette,
  animate,
  phase,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  palette: WorldPalette;
  animate: boolean;
  phase: number;
}) {
  const sat = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!sat.current) return;
    const a = (animate ? state.clock.elapsedTime * speed : 0) + phase;
    sat.current.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
  });
  return (
    <group rotation={tilt}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.0035, 6, 160]} />
        <meshBasicMaterial
          color={palette.secondary}
          transparent
          opacity={palette.light ? 0.35 : 0.22}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={sat}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color={palette.primary} />
      </mesh>
    </group>
  );
}

/* ---------- Developer standing on the world ---------- */

function Developer({ palette, animate }: { palette: WorldPalette; animate: boolean }) {
  const screen = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!animate || !screen.current) return;
    const t = state.clock.elapsedTime;
    screen.current.position.y = 0.36 + Math.sin(t * 1.1) * 0.015;
  });
  return (
    <group position={[0, GLOBE_R - 0.01, 0.12]} rotation={[0, -0.5, 0]} scale={0.9}>
      {/* silhouette */}
      <mesh position={[-0.032, 0.085, 0]}>
        <capsuleGeometry args={[0.022, 0.13, 4, 8]} />
        <meshBasicMaterial color={palette.ink} />
      </mesh>
      <mesh position={[0.032, 0.085, 0]}>
        <capsuleGeometry args={[0.022, 0.13, 4, 8]} />
        <meshBasicMaterial color={palette.ink} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <capsuleGeometry args={[0.055, 0.12, 4, 10]} />
        <meshBasicMaterial color={palette.ink} />
      </mesh>
      <mesh position={[0, 0.385, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color={palette.ink} />
      </mesh>
      {/* holographic screen the developer is working on */}
      <group ref={screen} position={[0.02, 0.36, 0.2]} rotation={[-0.15, 0, 0]}>
        <mesh>
          <planeGeometry args={[0.24, 0.14]} />
          <meshBasicMaterial
            color={palette.primary}
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(0.24, 0.14)]} />
          <lineBasicMaterial color={palette.primary} transparent opacity={0.9} />
        </lineSegments>
        {[0.035, 0.005, -0.025].map((y, i) => (
          <mesh key={y} position={[-0.03 + i * 0.012, y, 0.001]}>
            <planeGeometry args={[0.13 - i * 0.03, 0.01]} />
            <meshBasicMaterial
              color={palette.primary}
              transparent
              opacity={0.75}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
      {/* small glowing base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[0.07, 0.12, 40]} />
        <meshBasicMaterial
          color={palette.primary}
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ---------- Systems network: tech + API nodes with pulsing data ---------- */

type NodeDef = { pos: THREE.Vector3; label?: string };

function Network({
  palette,
  animate,
  hovered,
  setHovered,
}: {
  palette: WorldPalette;
  animate: boolean;
  hovered: string | null;
  setHovered: (id: string | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const pulses = useRef<THREE.Points>(null);
  const nodeRefs = useRef<(THREE.Object3D | null)[]>([]);

  const { nodes, edges, edgeLines, anchorLines } = useMemo(() => {
    const rand = mulberry32(7);
    const total = TECH.length + 6;
    const list: NodeDef[] = [];
    for (let i = 0; i < total; i++) {
      // spread around the globe, biased away from the poles
      const theta = (i / total) * Math.PI * 2 + rand() * 0.5;
      const y = (rand() - 0.5) * 2.6;
      const r = 2.5 + rand() * 0.6;
      list.push({
        pos: new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r),
        label: TECH[i],
      });
    }
    const pairs: [number, number][] = [];
    const seen = new Set<string>();
    list.forEach((n, i) => {
      list
        .map((m, j) => ({ j, d: n.pos.distanceTo(m.pos) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .forEach(({ j }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (!seen.has(key)) {
            seen.add(key);
            pairs.push([i, j]);
          }
        });
    });
    const lines: number[] = [];
    pairs.forEach(([a, b]) => lines.push(...list[a].pos.toArray(), ...list[b].pos.toArray()));
    // every few nodes plugs into the world itself
    const anchors: number[] = [];
    list.forEach((n, i) => {
      if (i % 2 === 0)
        anchors.push(
          ...n.pos.toArray(),
          ...n.pos
            .clone()
            .setLength(GLOBE_R * 1.02)
            .toArray(),
        );
    });
    return {
      nodes: list,
      edges: pairs,
      edgeLines: new Float32Array(lines),
      anchorLines: new Float32Array(anchors),
    };
  }, []);

  const pulsePositions = useMemo(() => new Float32Array(edges.length * 3), [edges]);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const t = animate ? state.clock.elapsedTime : 1.3;
    if (animate && group.current) group.current.rotation.y += dt * 0.02;
    edges.forEach(([a, b], i) => {
      const p = (t * 0.22 + i * 0.37) % 1;
      tmp.lerpVectors(nodes[a].pos, nodes[b].pos, p);
      pulsePositions[i * 3] = tmp.x;
      pulsePositions[i * 3 + 1] = tmp.y;
      pulsePositions[i * 3 + 2] = tmp.z;
    });
    if (pulses.current) pulses.current.geometry.attributes.position.needsUpdate = true;
    nodeRefs.current.forEach((m, i) => {
      if (!m) return;
      const isHover = hovered === `tech-${i}`;
      const s = (isHover ? 1.6 : 1) * (animate ? 1 + Math.sin(t * 1.4 + i) * 0.12 : 1);
      m.scale.setScalar(s);
      if (animate) m.rotation.y += dt * 0.4;
    });
  });

  const blending = palette.light ? THREE.NormalBlending : THREE.AdditiveBlending;

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgeLines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={palette.secondary}
          transparent
          opacity={palette.light ? 0.3 : 0.2}
          depthWrite={false}
        />
      </lineSegments>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[anchorLines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={palette.primary}
          transparent
          opacity={palette.light ? 0.2 : 0.12}
          depthWrite={false}
        />
      </lineSegments>
      <points ref={pulses}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          map={getDotTexture()}
          color={palette.primary}
          transparent
          depthWrite={false}
          blending={blending}
        />
      </points>
      {nodes.map((n, i) => {
        const id = `tech-${i}`;
        const isTech = Boolean(n.label);
        return (
          <group key={id} position={n.pos}>
            <group ref={(el) => void (nodeRefs.current[i] = el)}>
              {isTech ? (
                <>
                  <lineSegments>
                    <edgesGeometry args={[new THREE.OctahedronGeometry(0.11)]} />
                    <lineBasicMaterial
                      color={hovered === id ? palette.primary : palette.ink}
                      transparent
                      opacity={hovered === id ? 1 : 0.7}
                    />
                  </lineSegments>
                  <mesh>
                    <octahedronGeometry args={[0.045]} />
                    <meshBasicMaterial color={palette.primary} />
                  </mesh>
                </>
              ) : (
                <mesh>
                  <sphereGeometry args={[0.035, 10, 10]} />
                  <meshBasicMaterial color={palette.secondary} />
                </mesh>
              )}
            </group>
            {isTech && (
              // invisible, generous hit target so hovering is easy
              <mesh
                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                  e.stopPropagation();
                  setHovered(id);
                }}
                onPointerOut={() => setHovered(null)}
              >
                <sphereGeometry args={[0.24, 8, 8]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
              </mesh>
            )}
            {isTech && hovered === id && (
              <Html
                center
                position={[0, 0.3, 0]}
                zIndexRange={[20, 0]}
                style={{ pointerEvents: "none" }}
              >
                <div className="whitespace-nowrap rounded-full border border-primary/40 bg-background/85 px-3 py-1 font-mono text-[11px] font-semibold text-foreground shadow-lg backdrop-blur-md">
                  {n.label}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

/* ---------- Code → Ideas → AI → Innovation → Products ---------- */

function FlowPath({
  palette,
  animate,
  fontsReady,
  showLabels,
}: {
  palette: WorldPalette;
  animate: boolean;
  fontsReady: boolean;
  showLabels: boolean;
}) {
  const particles = useRef<THREE.Points>(null);
  const COUNT = 26;

  const { curve, linePts, waypoints } = useMemo(() => {
    const angles = [-115, -58, 0, 52, 108].map((d) => THREE.MathUtils.degToRad(d));
    const ys = [-1.25, -0.75, -0.15, 0.45, 1.0];
    const R = 2.15;
    const way = angles.map((a, i) => new THREE.Vector3(Math.sin(a) * R, ys[i], Math.cos(a) * R));
    const c = new THREE.CatmullRomCurve3(way, false, "centripetal");
    return {
      curve: c,
      linePts: new Float32Array(c.getPoints(160).flatMap((p) => p.toArray())),
      waypoints: way,
    };
  }, []);

  const labels = useMemo(
    () =>
      FLOW.map((w) =>
        textTexture(w.toUpperCase(), palette.ink, "600 {px}px 'JetBrains Mono', monospace", 44),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [palette, fontsReady],
  );
  useEffect(() => () => labels.forEach((l) => l.tex.dispose()), [labels]);

  // <line> clashes with the SVG element in JSX, so build the THREE.Line directly
  const pathLine = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(linePts, 3));
    const mat = new THREE.LineBasicMaterial({
      color: palette.primary,
      transparent: true,
      opacity: palette.light ? 0.45 : 0.3,
      depthWrite: false,
    });
    return new THREE.Line(geo, mat);
  }, [linePts, palette]);
  useEffect(
    () => () => {
      pathLine.geometry.dispose();
      (pathLine.material as THREE.Material).dispose();
    },
    [pathLine],
  );

  const positions = useMemo(() => new Float32Array(COUNT * 3), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = animate ? state.clock.elapsedTime : 0;
    for (let i = 0; i < COUNT; i++) {
      curve.getPointAt((t * 0.035 + i / COUNT) % 1, tmp);
      positions[i * 3] = tmp.x;
      positions[i * 3 + 1] = tmp.y;
      positions[i * 3 + 2] = tmp.z;
    }
    if (particles.current) particles.current.geometry.attributes.position.needsUpdate = true;
  });

  const blending = palette.light ? THREE.NormalBlending : THREE.AdditiveBlending;

  return (
    <group>
      <primitive object={pathLine} />
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          map={getDotTexture()}
          color={palette.primary}
          transparent
          depthWrite={false}
          blending={blending}
        />
      </points>
      {waypoints.map((p, i) => (
        <group key={FLOW[i]} position={p}>
          <mesh>
            <sphereGeometry args={[0.05, 14, 14]} />
            <meshBasicMaterial color={palette.primary} />
          </mesh>
          <sprite
            visible={showLabels}
            position={[0, 0.2, 0]}
            scale={[0.17 * labels[i].aspect, 0.17, 1]}
          >
            <spriteMaterial map={labels[i].tex} transparent opacity={0.85} depthWrite={false} />
          </sprite>
        </group>
      ))}
    </group>
  );
}

/* ---------- Floating project cards ---------- */

const CARD_SLOTS: [number, number, number][] = [
  [-1.45, 2.15, -0.6],
  [1.8, 1.6, 0.5],
  [1.85, -1.4, 0.8],
  [-0.35, -2.3, 1.2],
];

function ProjectCards({
  projects,
  palette,
  animate,
  fontsReady,
  hovered,
  setHovered,
  onSelect,
}: {
  projects: WorldProject[];
  palette: WorldPalette;
  animate: boolean;
  fontsReady: boolean;
  hovered: string | null;
  setHovered: (id: string | null) => void;
  onSelect: (title: string) => void;
}) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  const textures = useMemo(
    () => projects.map((p) => projectCardTexture(p, palette)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projects, palette, fontsReady],
  );
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);
  const camPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((g, i) => {
      if (!g) return;
      const base = CARD_SLOTS[i];
      g.position.y = base[1] + (animate ? Math.sin(t * 0.6 + i * 1.7) * 0.06 : 0);
      // cards gently turn toward the viewer so they stay legible
      g.getWorldPosition(camPos);
      const target =
        Math.atan2(state.camera.position.x - camPos.x, state.camera.position.z - camPos.z) * 0.6;
      g.rotation.y = animate ? THREE.MathUtils.damp(g.rotation.y, target, 3, dt) : target;
      const s = hovered === `project-${i}` ? 1.1 : 1;
      g.scale.setScalar(animate ? THREE.MathUtils.damp(g.scale.x, s, 8, dt) : s);
    });
  });

  return (
    <>
      {projects.map((p, i) => {
        const id = `project-${i}`;
        const active = hovered === id;
        return (
          <group key={p.title} ref={(el) => void (refs.current[i] = el)} position={CARD_SLOTS[i]}>
            <mesh
              onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                setHovered(id);
                setCursor(true);
              }}
              onPointerOut={() => {
                setHovered(null);
                setCursor(false);
              }}
              onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                setCursor(false);
                onSelect(p.title);
              }}
            >
              <planeGeometry args={[1.02, 0.6]} />
              <meshBasicMaterial
                map={textures[i]}
                transparent
                opacity={active ? 1 : palette.light ? 0.92 : 0.72}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
            {active && (
              <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[1.12, 0.7]} />
                <meshBasicMaterial
                  color={p.themeColor}
                  transparent
                  opacity={0.16}
                  depthWrite={false}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </>
  );
}

/* ---------- Background: code fragments + dust ---------- */

function CodeFragments({
  palette,
  animate,
  fontsReady,
}: {
  palette: WorldPalette;
  animate: boolean;
  fontsReady: boolean;
}) {
  const refs = useRef<(THREE.Sprite | null)[]>([]);
  const slots: [number, number, number][] = [
    [-1.4, 2.9, -3.5],
    [3.2, 2.5, -4],
    [-1.0, -2.9, -3],
    [3.4, -2.4, -2.5],
    [1.0, 3.6, -5],
  ];
  const textures = useMemo(
    () =>
      CODE_SNIPPETS.map((s) =>
        textTexture(s, palette.ink, "400 {px}px 'JetBrains Mono', monospace", 40),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [palette, fontsReady],
  );
  useEffect(() => () => textures.forEach((t) => t.tex.dispose()), [textures]);

  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.elapsedTime;
    refs.current.forEach((s, i) => {
      if (s) s.position.y = slots[i][1] + Math.sin(t * 0.25 + i * 2) * 0.15;
    });
  });

  return (
    <>
      {textures.map((tx, i) => (
        <sprite
          key={CODE_SNIPPETS[i]}
          ref={(el) => void (refs.current[i] = el)}
          position={slots[i]}
          scale={[0.22 * tx.aspect, 0.22, 1]}
        >
          <spriteMaterial
            map={tx.tex}
            transparent
            opacity={palette.light ? 0.4 : 0.3}
            depthWrite={false}
          />
        </sprite>
      ))}
    </>
  );
}

function Dust({
  palette,
  animate,
  count,
}: {
  palette: WorldPalette;
  animate: boolean;
  count: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const rand = mulberry32(42);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * 18;
      arr[i * 3 + 1] = (rand() - 0.5) * 10;
      arr[i * 3 + 2] = (rand() - 0.5) * 12 - 2;
    }
    return arr;
  }, [count]);
  useFrame((_, dt) => {
    if (animate && ref.current) ref.current.rotation.y += dt * 0.008;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        map={getDotTexture()}
        color={palette.secondary}
        transparent
        opacity={palette.light ? 0.45 : 0.4}
        depthWrite={false}
        blending={palette.light ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------- Camera rig: drift, parallax, scroll and the "Enter the World" fly-through ---------- */

function Rig({
  animate,
  entering,
  pointer,
  onEntered,
  world,
}: {
  animate: boolean;
  entering: boolean;
  pointer: PointerRef;
  onEntered: () => void;
  world: MutableRefObject<THREE.Group | null>;
}) {
  const { camera, size } = useThree();
  const enter = useRef(0);
  const fired = useRef(false);
  const look = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (entering) {
      enter.current = 0;
      fired.current = false;
    }
  }, [entering]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const aspect = size.width / size.height;
    // Wide screens: the world sits to the right of the headline.
    // Narrow / portrait: it rises from the bottom, behind the call-to-action buttons.
    const wide = aspect > 1.35 && size.width >= 1024;
    const offsetX = wide ? Math.min(Math.max(aspect * 2.1, 2.6), 3.9) : 0;
    const offsetY = wide ? 0 : aspect < 1 ? -2.9 : -1.8;
    const scale = wide ? 0.85 : 0.9;
    if (world.current) {
      world.current.position.set(offsetX, offsetY, 0);
      world.current.scale.setScalar(scale);
    }

    const scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.2);
    const p = animate ? pointer.current : { x: 0, y: 0 };
    const drift = animate ? Math.sin(t * 0.07) * 0.35 : 0;
    const bob = animate ? Math.sin(t * 0.05) * 0.18 : 0;

    let x = drift + p.x * 0.55;
    let y = 0.5 + bob - p.y * 0.3 + scroll * 1.1;
    let z = 9.5 + scroll * 2.2;
    look.set(offsetX * 0.55, offsetY * 0.5 + scroll * 0.4, 0);

    if (entering) {
      enter.current = Math.min(1, enter.current + dt / 1.9);
      const e = enter.current * enter.current * (3 - 2 * enter.current); // smoothstep
      // fly forward through the network and into the globe
      x = THREE.MathUtils.lerp(x, offsetX, e);
      y = THREE.MathUtils.lerp(y, offsetY + 0.3, e);
      z = THREE.MathUtils.lerp(z, 0.6, e);
      look.set(offsetX, offsetY, -4);
      if (enter.current >= 1 && !fired.current) {
        fired.current = true;
        onEntered();
      }
      camera.position.set(x, y, z);
    } else if (animate) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 2.2, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 2.2, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 2.2, dt);
    } else {
      camera.position.set(x, y, z);
    }
    camera.lookAt(look);
  });
  return null;
}

/* ---------- Root ---------- */

function World(props: SceneProps & { fontsReady: boolean }) {
  const {
    palette,
    projects,
    animate,
    compact,
    entering,
    pointer,
    onEntered,
    onSelectProject,
    fontsReady,
  } = props;
  const [hovered, setHovered] = useState<string | null>(null);
  const world = useRef<THREE.Group>(null);

  useEffect(() => () => setCursor(false), []);

  return (
    <>
      <Rig
        animate={animate}
        entering={entering}
        pointer={pointer}
        onEntered={onEntered}
        world={world}
      />
      <Dust palette={palette} animate={animate} count={compact ? 120 : 260} />
      <group ref={world}>
        {!compact && <CodeFragments palette={palette} animate={animate} fontsReady={fontsReady} />}
        <Globe palette={palette} animate={animate} compact={compact} />
        {!compact && <Developer palette={palette} animate={animate} />}
        <Orbit
          radius={2.05}
          tilt={[0.35, 0, 0.25]}
          speed={0.12}
          palette={palette}
          animate={animate}
          phase={0}
        />
        <Orbit
          radius={2.4}
          tilt={[-0.25, 0, -0.4]}
          speed={-0.08}
          palette={palette}
          animate={animate}
          phase={2}
        />
        <Network palette={palette} animate={animate} hovered={hovered} setHovered={setHovered} />
        <FlowPath
          palette={palette}
          animate={animate}
          fontsReady={fontsReady}
          showLabels={!compact}
        />
        {!compact && (
          <ProjectCards
            projects={projects}
            palette={palette}
            animate={animate}
            fontsReady={fontsReady}
            hovered={hovered}
            setHovered={setHovered}
            onSelect={onSelectProject}
          />
        )}
      </group>
    </>
  );
}

export default function WorldScene(props: SceneProps) {
  const fontsReady = useFontsReady();
  const { animate, running, compact, onContextLost, onCreated } = props;

  return (
    <Canvas
      // flat = no tone mapping, so theme colours (and the page-matching globe core) render exactly
      flat
      // render continuously only while the hero is on screen and motion is allowed
      frameloop={running && animate ? "always" : "demand"}
      dpr={compact ? [1, 1.25] : [1, 1.6]}
      gl={{ antialias: !compact, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.5, 9.5], fov: 40, near: 0.1, far: 60 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onContextLost();
        });
        onCreated();
      }}
    >
      <World {...props} fontsReady={fontsReady} />
    </Canvas>
  );
}
