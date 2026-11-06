export function ProjectBackgroundAnimation() {
  return (
    <div className="project-bg-canvas" aria-hidden="true">
      {/* Subtle, elegant ambient atmospheric gradient */}
      <div className="bg-subtle-glow glow-top" />
      <div className="bg-subtle-glow glow-bottom" />
      <div className="bg-clean-grid" />
    </div>
  );
}
