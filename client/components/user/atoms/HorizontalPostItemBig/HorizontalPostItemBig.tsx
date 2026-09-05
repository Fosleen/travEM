import { FC } from "react";
import "./HorizontalPostItemBig.scss";
import { formatDate } from "../../../../utils/global";
import { HorizontalPostItemBigProps } from "../../../../common/types";
import Image from "next/image";
import Link from "next/link";
import { toUrlSlug } from "@/utils/url";
import { getArticleUrl } from "@/utils/articleUrl";

const HorizontalPostItemBig: FC<HorizontalPostItemBigProps> = ({
  stretched,
  thin,
  hasDate = true,
  type = "article",
  href: customHref,
  variant,
  data,
}) => {
  const href = customHref ||
    (type === "article"
      ? getArticleUrl(data)
      : `/destinacija/${toUrlSlug(data.name || "")}`);

  const rawFlagUrl =
    (data as any)?.country?.flag_image_url || (data as any)?.flag_image_url;
  const flagUrl = rawFlagUrl ? String(rawFlagUrl).trim() : "";
  const mainImageUrl = data?.main_image_url
    ? String(data.main_image_url).trim()
    : "";

  const formattedDate = data?.date_written
    ? formatDate(new Date(data.date_written))
    : null;

  return (
    <Link href={href}>
      <div
        className={`horizontal-post-item-big-container ${
          stretched ? "stretched" : ""
        }${thin ? " thin" : ""}${variant ? ` ${variant}` : ""}`}
      >
        {flagUrl && (
          <div className="favorite-post-item-icon-container">
            <Image
              className="favorite-post-item-icon"
              src={flagUrl}
              alt="Zastava"
              width={38}
              height={38}
              unoptimized
            />
          </div>
        )}

        <div className="horizontal-post-item-big-image-container">
          <Image
            src={mainImageUrl}
            alt={data?.title || data?.name || "Post image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            unoptimized
            priority={false}
          />
        </div>

        <div className="horizontal-post-item-big-text-container">
          <h4>{type === "article" ? data?.title : data?.name}</h4>

          {variant !== "airport" && (
            <div className="horizontal-post-item-big-inner-text-container">
              <p>{data?.subtitle}</p>

              {!stretched && hasDate && formattedDate && (
                <p>{formattedDate}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default HorizontalPostItemBig;
