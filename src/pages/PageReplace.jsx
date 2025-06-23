import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function PageReplacementSimulator() {
  

  const [referenceString, setReferenceString] = useState('');
  const [numFrames, setNumFrames] = useState(3);
  const [algorithm, setAlgorithm] = useState('FIFO');
  const [steps, setSteps] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const navigate=useNavigate();

  const simulateAlgorithm = (refs, algo) => {
    let memory = [];
    let history = [];
    let index = 0;
    const seen = new Map();
    let faults = 0;

    refs.forEach((page, stepIndex) => {
      let status = 'Hit';
      if (!memory.includes(page)) {
        status = 'Fault';
        faults++;

        if (memory.length < numFrames) {
          memory.push(page);
        } else {
          if (algo === 'FIFO') {
            memory[index % numFrames] = page;
            index++;
          } else if (algo === 'LRU') {
            let lruPage = [...seen.entries()].sort((a, b) => a[1] - b[1])[0][0];
            const lruIndex = memory.indexOf(lruPage);
            memory[lruIndex] = page;
          } else if (algo === 'Optimal') {
            let future = refs.slice(stepIndex + 1);
            let indexes = memory.map(p => future.indexOf(p));
            let replaceIndex = indexes.includes(-1)
              ? indexes.indexOf(-1)
              : indexes.indexOf(Math.max(...indexes));
            memory[replaceIndex] = page;
          }
        }
      }
      seen.set(page, stepIndex);
      history.push({ memory: [...memory], page, status });
    });

    return { history, faults };
  };

const simulate = () => {
  if (!referenceString.trim()) return;

  const refs = referenceString.split(/\s+/).map(Number);

  // Reset previous steps & comparison data
  setSteps([]);
  setComparisonData([]);

  // Simulate selected algorithm
  const selectedResult = simulateAlgorithm(refs, algorithm);
  setSteps(selectedResult.history);

  // Simulate comparison for all algorithms
  const comparison = ['FIFO', 'LRU', 'Optimal'].map((algo) => {
    const res = simulateAlgorithm(refs, algo);
    return { algorithm: algo, pageFaults: res.faults };
  });
  setComparisonData(comparison);

  // Force re-render of simulation result components
  setSimulationKey(prev => prev + 1);
};



  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto bg-black text-white rounded shadow mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className='flex justify-between'>
      <h2 className="text-2xl font-semibold mb-4">Page Replacement Simulator</h2>
      <button onClick={()=>{navigate("/contMem")}} class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
<span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
Back
</span>
</button>
      </div>
      <div className="space-y-4">
        <label className="block">
          Page Reference String:
          <input
            type="text"
            className="w-full p-2 mt-1 border rounded bg-gray-900 text-white"
            placeholder="e.g. 7 0 1 2 0 3 0 4"
            value={referenceString}
            onChange={(e) => setReferenceString(e.target.value)}
          />
        </label>

        <label className="block">
          Number of Frames:
          <input
            type="number"
            className="w-full p-2 mt-1 border rounded bg-gray-900 text-white"
            value={numFrames}
            min={1}
            onChange={(e) => setNumFrames(Number(e.target.value))}
          />
        </label>

        <label className="block">
          Algorithm:
          <select
            className="w-full p-2 mt-1 border rounded bg-gray-900 text-white"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option value="FIFO">FIFO</option>
            <option value="LRU">LRU</option>
            <option value="Optimal">Optimal</option>
          </select>
        </label>

        <motion.button
          className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-cyan-200"
          onClick={simulate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black rounded-md group-hover:bg-transparent">
            Simulate
          </span>
        </motion.button>
      </div>

      {steps.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="font-semibold text-lg">Simulation Steps:</h3>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className={`p-2 rounded border text-sm font-mono transition-all duration-300 ${
                  step.status === 'Fault'
                    ? 'bg-red-600 border-red-500'
                    : 'bg-green-600 border-green-500'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <strong>Step {i + 1}:</strong> Page <strong>{step.page}</strong> →{' '}
                <span className="font-semibold">{step.status}</span>
                <br />
                Frames: <span className="tracking-wide">{step.memory.join(' | ')}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {comparisonData.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-2">Page Fault Comparison:</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={comparisonData}>
              <XAxis dataKey="algorithm" stroke="#ccc" />
              <YAxis allowDecimals={false} stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444', color: '#fff' }} />
              <Legend />
              <Bar dataKey="pageFaults" fill="#22d3ee" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
