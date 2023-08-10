"use client";

import * as React from "react";
import Image, { ImageProps } from "next/image";
import { GalleryImages } from "@ronin/casper";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "framer-motion";
import { GetGalleryImagesQuery } from "~/app/api/gallery/route";

function makeColumns(images: GalleryImages) {
  const COLUMN_COUNT = 3;

  const columns: GalleryImages[] = [];

  for (let i = 0; i < images.length; i++) {
    const column = columns[i % COLUMN_COUNT] || [];
    const image = images[i]!;

    column.push(image);
    columns[i % COLUMN_COUNT] = column;
  }

  return columns;
}

export function Gallery({ initialData }: { initialData: GalleryImages }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  const { fetchNextPage, data } = useInfiniteQuery<GalleryImages, unknown, GetGalleryImagesQuery>({
    initialData: { pages: [initialData], pageParams: [undefined, initialData.moreAfter] },
    queryKey: ["gallery"],
    queryFn: async ({ pageParam }) => {
      const url = process.env.VERCEL_URL || "http://localhost:3000";
      const res = await fetch(`${url}/api/gallery?after=${pageParam}`);
      const data = (await res.json()) as GalleryImages;
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.moreAfter,
  });

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns = React.useMemo(() => {
    const pagesData = data?.pages ?? [];
    const columns = makeColumns(pagesData.map((page) => page.data).flat());
    return columns;
  }, [data]);

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-5">
      {columns.map((column, i) => (
        <Column key={`column-${i}`}>
          {column.map((image) => {
            return (
              <ImageItem
                key={image.media.key}
                src={image.media.src}
                width={image.media.meta.width / 4}
                height={image.media.meta.height / 4}
                alt={image.title}
                blurDataURL={image.media.placeholder.base64 || undefined}
                id={image.id}
              />
            );
          })}
        </Column>
      ))}

      <div ref={ref} />
    </div>
  );
}

function Column(props: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3">{props.children}</div>;
}

function ImageItem(props: ImageProps) {
  return (
    <Link href={`/photo/${props.id}`}>
      <Image
        className="relative w-full h-fit overflow-hidden shadow-lg cursor-zoom-in object-cover"
        placeholder="blur"
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
        quality={60}
        {...props}
      />
    </Link>
  );
}
