export function allocateProcess(blocks, process) {
  const newBlocks = [...blocks];
  const neededSize = process.size;

  // Find all free blocks
  const freeBlocks = newBlocks
    .map((block, index) => ({ ...block, index }))
    .filter((b) => b.free && b.spaceLeft > 0);

  let totalFree = freeBlocks.length;

  // Check if there are enough blocks
  if (Math.ceil(neededSize / freeBlocks[0]?.size || 1) > totalFree) {
    return [blocks, false]; // Not enough blocks
  }

  const blocksUsed = [];
  let remaining = neededSize;

  for (let i = 0; i < freeBlocks.length && remaining > 0; i++) {
    const { index } = freeBlocks[i];
    const blockSize = newBlocks[index].size;

    newBlocks[index] = {
      ...newBlocks[index],
      free: false,
      spaceLeft: 0,
      processId: process.id,
      used: Math.min(blockSize, remaining), // to visualize how much was used
    };

    blocksUsed.push(index);
    remaining -= blockSize;
  }

  return [newBlocks, true];
}
