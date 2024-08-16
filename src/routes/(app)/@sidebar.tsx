import { ParentComponent } from "solid-js/types/server/rendering.js";

const SidebarLayout: ParentComponent<{}> = (props) => {
  return <>{props.children}</>;
};

export default SidebarLayout;
