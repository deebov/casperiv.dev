import type { TimelineItem as TTimelineItem } from "types/Timeline";

interface Props {
  item: TTimelineItem;
}

export const TimelineItem = ({ item }: Props) => {
  return (
    <li className="my-5">
      <h5 className="text-lg font-medium">
        {item.tag ? (
          <span className="mr-2 px-1.5 p-0.5 text-base lowercase rounded-md bg-gradient-to-tr from-[#1150d4] to-[#a245fc]">
            {item.tag}
          </span>
        ) : null}

        {item.url ? (
          <a target="_blank" rel="noreferrer noopener" href={item.url}>
            {item.title}
          </a>
        ) : (
          item.title
        )}
      </h5>

      <p className="mt-1 text-base text-gray-300">{item.text}</p>
    </li>
  );
};
