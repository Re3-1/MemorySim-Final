import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function DynamicPartitionMemorySim() {
  const navigate=useNavigate();
  const [totalMemory, setTotalMemory] = useState(1024);
  const [processes, setProcesses] = useState('');
  const [memoryBlocks, setMemoryBlocks] = useState([]);
  const [externalFragmentation, setExternalFragmentation] = useState(0);

  const allocateProcesses = () => {
    const parsedProcesses = processes.split(/\s+/).map(Number);
    let remainingMemory = totalMemory;
    let memoryLayout = [];
    let unallocatedProcesses = [];

    parsedProcesses.forEach((process, i) => {
      if (remainingMemory >= process) {
        memoryLayout.push({
          processId: `P${i + 1}`,
          size: process,
          allocated: true,
        });
        remainingMemory -= process;
      } else {
        memoryLayout.push({
          processId: `P${i + 1}`,
          size: process,
          allocated: false,
        });
        unallocatedProcesses.push(process);
      }
    });

    if (remainingMemory > 0) {
      memoryLayout.push({
        processId: 'Free',
        size: remainingMemory,
        allocated: true,
        free: true,
      });
    }

  
    let externalFrag = 0;
    if (remainingMemory >= Math.min(...unallocatedProcesses, remainingMemory + 1)) {
      externalFrag = remainingMemory;
    }

    setExternalFragmentation(externalFrag);
    setMemoryBlocks(memoryLayout);
  };

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto bg-black text-white rounded shadow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className='flex justify-between'><h2 className="text-2xl font-semibold mb-4">Dynamic Partition Memory Allocation</h2>
      <button onClick={()=>{navigate("/contMem")}} class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
<span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
Back
</span>
</button>
      </div>
      

      <div className="space-y-4">
        <label className="block">
          Total Memory (KB):
          <input
            type="number"
            className="w-full p-2 mt-1 border rounded bg-gray-900 text-white"
            value={totalMemory}
            onChange={(e) => setTotalMemory(Number(e.target.value))}
          />
        </label>
        <label className="block">
          Processes (space-separated KB sizes):
          <input
            type="text"
            className="w-full p-2 mt-1 border rounded bg-gray-900 text-white"
            placeholder="e.g. 100 250 120"
            value={processes}
            onChange={(e) => setProcesses(e.target.value)}
          />
        </label>

        <motion.button
          onClick={allocateProcesses}
          className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-400 group-hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black rounded-md group-hover:bg-transparent">
            Allocate
          </span>
        </motion.button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Memory Layout:</h3>
        <div className="space-y-2">
          {memoryBlocks.map((block, i) => (
            <motion.div
              key={i}
              className={`p-2 text-sm border rounded flex justify-between items-center ${
                !block.allocated
                  ? 'bg-red-500 text-black'
                  : block.free
                  ? 'bg-gray-800 text-gray-400'
                  : 'bg-gradient-to-br from-green-400 to-blue-600 text-white'
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div>{block.processId}</div>
              <div>{block.size}KB</div>
              {!block.allocated && <div className="text-xs">Not Allocated</div>}
            </motion.div>
          ))}
        </div>

        {externalFragmentation > 0 && (
          <div className="mt-4 text-sm text-yellow-300 bg-yellow-900 p-2 rounded">
            ⚠ External Fragmentation Detected: {externalFragmentation}KB free but not usable by any single process.
          </div>
        )}
      </div>
    </motion.div>
  );
}
