export function allocateProcess(process, blocks) {
  const { size, id, algo } = process;
  let candidateIndex = -1;

  if (algo === "ff") {
    candidateIndex = blocks.findIndex(block => block.free && block.spaceLeft >= size);
  } else if (algo === "bf") {
    let minWaste = Infinity;
    blocks.forEach((block, index) => {
      if (block.free && block.spaceLeft >= size) {
        const waste = block.spaceLeft - size;
        if (waste < minWaste) {
          minWaste = waste;
          candidateIndex = index;
        }
      }
    });
  } else if (algo === "wf") {
    let maxWaste = -1;
    blocks.forEach((block, index) => {
      if (block.free && block.spaceLeft >= size) {
        const waste = block.spaceLeft - size;
        if (waste > maxWaste) {
          maxWaste = waste;
          candidateIndex = index;
        }
      }
    });
  }

  if (candidateIndex !== -1) {
    blocks[candidateIndex].spaceLeft -= size;
    blocks[candidateIndex].free = blocks[candidateIndex].spaceLeft === 0 ? false : true;
    blocks[candidateIndex].processId = id;
    blocks[candidateIndex].allocatedSize = size;
  }

  return blocks;
}
