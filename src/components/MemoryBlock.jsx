import { motion } from "framer-motion";

export function MemoryBlock({ block }) {
  const { spaceLeft, size, allocatedSize, processId } = block;
  const usedPercent = (allocatedSize / size) * 100;
  const fragmentPercent = ((size - allocatedSize) / size) * 100;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-24 h-32 border-2 border-white m-2 relative rounded-lg overflow-hidden bg-gray-800"
    >
      <motion.div
        className="bg-green-400 absolute bottom-0 left-0 w-full"
        style={{ height: `${usedPercent}%` }}
        layout
        transition={{ duration: 0.5 }}
      />
      {fragmentPercent > 0 && (
        <motion.div
          className="bg-red-400 absolute left-0 w-full"
          style={{ bottom: `${usedPercent}%`, height: `${fragmentPercent}%` }}
          layout
          transition={{ duration: 0.5 }}
        />
      )}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-xs text-white">
        <div>PID: {processId || "Free"}</div>
        <div>Used: {allocatedSize || 0}</div>
        <div>Frag: {size - (allocatedSize || 0)}</div>
      </div>
    </motion.div>
  );
}
