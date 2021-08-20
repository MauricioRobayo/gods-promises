import { Semoji } from "switch-emoji";

type Props = {
  emoji: string;
  height?: string;
  className?: string;
};

const Twemoji = (props: Props) => {
  return <Semoji {...props} source="Twitter" />;
};

export default Twemoji;
