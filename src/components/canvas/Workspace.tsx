import React from 'react';

// Import all objects
import MainMonitor from './objects/MainMonitor';
import Laptop from './objects/Laptop';
import Bookshelf from './objects/Bookshelf';
import Workbench from './objects/Workbench';
import HolographicTable from './objects/HolographicTable';
import ServerRack from './objects/ServerRack';
import EntertainmentShelf from './objects/EntertainmentShelf';
import PanoramicWindow from './objects/PanoramicWindow';
import CommunicationTerminal from './objects/CommunicationTerminal';
import PinBoard from './objects/PinBoard';

export const Workspace: React.FC = () => {
  return (
    <group>
      {/* 1. Main Monitor -> projects list */}
      <MainMonitor />

      {/* 2. Laptop -> About Me */}
      <Laptop />

      {/* 3. Bookshelf -> Education */}
      <Bookshelf />

      {/* 4. Workbench -> Technical Skills */}
      <Workbench />

      {/* 5. Holographic Table -> Showcase / Hero */}
      <HolographicTable />

      {/* 6. Server Rack -> Work Experience */}
      <ServerRack />

      {/* 7. Entertainment Shelf -> Hobbies */}
      <EntertainmentShelf />

      {/* 8. Panoramic Window -> Goals */}
      <PanoramicWindow />

      {/* 9. Communication Terminal -> Contact */}
      <CommunicationTerminal />

      {/* 10. Pin Board -> Pinned Projects */}
      <PinBoard />
    </group>
  );
};
export default Workspace;
