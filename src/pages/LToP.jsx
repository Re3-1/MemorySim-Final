import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function generatePageTable(numPages, numFrames) {
  const usedFrames = new Set();
  const table = {};

  for (let i = 0; i < numPages; i++) {
    let frame;
    do {
      frame = Math.floor(Math.random() * numFrames);
    } while (usedFrames.has(frame));
    usedFrames.add(frame);
    table[i] = frame;
  }

  return table;
}

export function LToP() {
  const navigate=useNavigate();
  const [logicalAddress, setLogicalAddress] = useState('');
  const [pageSize, setPageSize] = useState(4096);
  const [numPages, setNumPages] = useState(16);
  const [numFrames, setNumFrames] = useState(16);
  const [pageTable, setPageTable] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    setPageTable(generatePageTable(numPages, numFrames));
  }, [numPages, numFrames]);

  const handleTranslate = () => {
    const logical = parseInt(logicalAddress, 10);
    if (isNaN(logical)) return;

    const pageNumber = Math.floor(logical / pageSize);
    const offset = logical % pageSize;

    if (!(pageNumber in pageTable)) {
      alert(`Page ${pageNumber} not found in page table.`);
      return;
    }

    const frameNumber = pageTable[pageNumber];
    const physicalAddress = frameNumber * pageSize + offset;

    setResult({
      logical,
      pageNumber,
      offset,
      frameNumber,
      physicalAddress,
    });
  };

  const handleRegenerate = () => {
    setPageTable(generatePageTable(numPages, numFrames));
    setResult(null);
  };

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto mt-8 bg-black text-white rounded shadow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >

      <motion.div className='flex justify-between'>
        <motion.h2
        className="text-2xl font-semibold mb-4"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Logical to Physical Address Translator
      </motion.h2>
       <button onClick={()=>{navigate("/contNonMem")}} class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
<span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
Back
</span>
</button>
      
      
      </motion.div>
      

      <div className="space-y-4">
        <label className="block">
          Logical Address:
          <motion.input
            type="number"
            value={logicalAddress}
            onChange={(e) => setLogicalAddress(e.target.value)}
            className="w-full p-2 mt-1 border rounded bg-gray-900 text-white"
            whileFocus={{ scale: 1.05 }}
          />
        </label>

        <label className="block">
          Page Size (bytes):
          <motion.select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="w-full p-2 mt-1 border rounded bg-gray-900 text-white"
            whileFocus={{ scale: 1.05 }}
          >
            <option value={256}>256</option>
            <option value={512}>512</option>
            <option value={1024}>1024 (1KB)</option>
            <option value={2048}>2048 (2KB)</option>
            <option value={4096}>4096 (4KB)</option>
          </motion.select>
        </label>

        <motion.div className="flex space-x-3">
          <motion.button
            onClick={handleTranslate}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-400 group-hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-cyan-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black rounded-md group-hover:bg-transparent">
              Translate
            </span>
          </motion.button>

          <motion.button
            onClick={handleRegenerate}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 focus:ring-4 focus:outline-none focus:ring-green-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black rounded-md group-hover:bg-transparent">
              Regenerate
            </span>
          </motion.button>
        </motion.div>
      </div>

      {result && (
        <div className="mt-8">
          <motion.div
            className="flex items-center justify-center space-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="p-3 border rounded bg-cyan-700 text-white"
              initial={{ x: -80 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-bold text-center">CPU</p>
              <p className="text-sm">Logical Addr: {result.logical}</p>
            </motion.div>

            <motion.div
              className="p-3 border rounded bg-yellow-600 text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <p className="font-bold text-center">MMU</p>
              <p className="text-sm">→ Page: {result.pageNumber}</p>
              <p className="text-sm">→ Offset: {result.offset}</p>
              <p className="text-sm">→ Frame: {result.frameNumber}</p>
            </motion.div>

            <motion.div
              className="p-3 border rounded bg-green-600 text-white"
              initial={{ x: 80 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-bold text-center">RAM</p>
              <p className="text-sm">Physical Addr: {result.physicalAddress}</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-4 p-3 border rounded bg-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="font-semibold">Translation Result:</h3>
            <motion.p layout>Logical Address: {result.logical}</motion.p>
            <motion.p layout>→ Page Number: {result.pageNumber}</motion.p>
            <motion.p layout>→ Offset: {result.offset}</motion.p>
            <motion.p layout>Frame Number: {result.frameNumber}</motion.p>
            <motion.p layout>Physical Address: {result.physicalAddress}</motion.p>
          </motion.div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Page Table:</h3>
        <table className="w-full border mt-2 text-white">
          <thead>
            <tr>
              <th className="border p-1">Page #</th>
              <th className="border p-1">Frame #</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(pageTable).map(([page, frame]) => (
              <motion.tr
                key={page}
                className={result?.pageNumber === Number(page) ? 'bg-yellow-700' : ''}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td className="border p-1 text-center">{page}</td>
                <td className="border p-1 text-center">{frame}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">RAM Frames:</h3>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: numFrames }).map((_, i) => {
            const pageInFrame = Object.entries(pageTable).find(([, frame]) => frame === i)?.[0];
            return (
              <motion.div
                key={i}
                className={`border p-2 rounded text-center ${
                  result?.frameNumber === i
                    ? 'bg-green-500 text-black'
                    : 'bg-gray-800 text-gray-400'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-xs">Frame {i}</p>
                <p className="text-sm font-bold">
                  {pageInFrame !== undefined ? `Page ${pageInFrame}` : '—'}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
