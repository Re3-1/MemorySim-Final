import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PageReplacementSimulator() {
  const [refStr, setRefStr] = useState('');
  const [frameCount, setFrameCount] = useState(3);
  const [algo, setAlgo] = useState('FIFO');
  const [steps, setSteps] = useState([]);
  const [chartData, setChartData] = useState([]);

  function runSim(refs, algo) {
    let mem = [];
    let hist = [];
    let index = 0;
    let track = {};
    let faults = 0;

    for (let i = 0; i < refs.length; i++) {
      let p = refs[i];
      let stat = 'Hit';
      if (!mem.includes(p)) {
        stat = 'Fault';
        faults++;
        if (mem.length < frameCount) {
          mem.push(p);
        } else {
          if (algo === 'FIFO') {
            mem[index % frameCount] = p;
            index++;
          } else if (algo === 'LRU') {
            let arr = Object.entries(track).sort((a, b) => a[1] - b[1]);
            let lru = arr[0][0];
            let ix = mem.indexOf(Number(lru));
            mem[ix] = p;
          } else if (algo === 'Optimal') {
            let next = refs.slice(i + 1);
            let pos = mem.map(m => next.indexOf(m));
            let hasMinusOne = pos.includes(-1);
            let maxValue = Math.max(...pos);
            let maxIndex = pos.indexOf(maxValue);
            let minusOneIndex = pos.indexOf(-1);

            let rIndex = hasMinusOne ? minusOneIndex : maxIndex;
            mem[rIndex] = p;
          }
        }
      }
      track[p] = i;
      hist.push({ mem: [...mem], p, stat });
    }

    return { hist, faults };
  }

  const simulate = () => {
    if (!refStr.trim()) return;
    let refs = refStr.split(/\s+/).map(x => parseInt(x));
    let res = runSim(refs, algo);
    setSteps(res.hist);

    let compare = ['FIFO', 'LRU', 'Optimal'].map(a => {
      let r = runSim(refs, a);
      return { algorithm: a, pageFaults: r.faults };
    });

    setChartData(compare);
  };

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto bg-black text-white rounded shadow mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Page Replacement Simulator</h2>

      <div className="space-y-4">
        <label className="block">
          Page Reference String:
          <input
            type="text"
            value={refStr}
            onChange={(e) => setRefStr(e.target.value)}
            className="w-full p-2 mt-1 border rounded bg-gray-900 text-white"
            placeholder="e.g. 7 0 1 2 0 3 0 4"
          />
        </label>

        <label className="block">
          Number of Frames:
          <input
            type="number"
            value={frameCount}
            onChange={(e) => setFrameCount(Number(e.target.value))}
            min={1}
            className="w-full p-2 mt-1 border rounded bg-gray-900 text-white"
          />
        </label>

        <label className="block">
          Algorithm:
          <select
            value={algo}
            onChange={(e) => setAlgo(e.target.value)}
            className="w-full p-2 mt-1 border rounded bg-gray-900 text-white"
          >
            <option value="FIFO">FIFO</option>
            <option value="LRU">LRU</option>
            <option value="Optimal">Optimal</option>
          </select>
        </label>

        <motion.button
          onClick={simulate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-cyan-200"
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
            {steps.map((s, idx) => (
              <motion.div
                key={idx}
                className={`p-2 rounded border text-sm font-mono transition-all duration-300 ${
                  s.stat === 'Fault'
                    ? 'bg-red-600 border-red-500'
                    : 'bg-green-600 border-green-500'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <strong>Step {idx + 1}:</strong> Page <strong>{s.p}</strong> →{' '}
                <span className="font-semibold">{s.stat}</span>
                <br />
                Frames: <span className="tracking-wide">{s.mem.join(' | ')}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-2">Page Fault Comparison:</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
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
