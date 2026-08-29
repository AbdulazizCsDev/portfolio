import tree from '../assets/neural-tree.svg?raw';
import './NeuralTree.css';

// The one visual element in the site. Generated once by scripts/generate-tree.mjs
// with a fixed seed and committed, so there is no randomness at runtime and
// every visitor sees the same drawing.
//
// It is inlined rather than loaded as an <img> so the branches can take their
// colour from the mode and draw themselves in on load.
export default function NeuralTree() {
  return (
    <div
      className="neural-tree"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: tree }}
    />
  );
}
