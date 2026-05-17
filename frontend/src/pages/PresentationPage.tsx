/**
 * Presentation page — mounts the scroll-snapping Presentation component
 * which in turn renders every slide registered in presentation/slides/registry.
 */
import { Presentation } from '../presentation/Presentation';

export function PresentationPage() {
  return <Presentation />;
}
