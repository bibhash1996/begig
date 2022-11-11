import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { Waypoint } from 'react-waypoint';

type DataItem = {
  copyright: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  thumbnail_url: string;
};

type MediaType = "image" | "vedio";

function MediaCard(props: {
  className: string;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string;
}) {
  if (props.mediaType === "image") {
    return (
      <img
        src={props.thumbnailUrl || props.mediaUrl}
        className={props.className}
      />
    );
  }
  return (
    <video
      className={props.className}
      poster={props.thumbnailUrl}
    // disablePictureInPicture={disablePictureInPicture}
    // controlsList={controlsList}
    // onMouseOver={(e) => hoverFeature && (e.target as HTMLVideoElement).play()}
    // onMouseLeave={(e) =>
    //   hoverFeature && (e.target as HTMLVideoElement).pause()
    // }
    // controls={controls}
    // height={height}
    // width={width}
    // disableRemotePlayback
    // autoPlay={autoPlay}
    // muted={muted}
    // className="nftVideo"
    // loop={loop}
    // playsInline={playsInline}
    // onDurationChange={onDurationChange}
    // onCanPlay={onLoad}
    // onError={onError}
    // onLoadedData={onLoadedData}
    >
      <source src={`${props.mediaUrl}#t=0.001`} type="video/mp4" />
    </video>
  );
}

const Home = () => {
  const [data, setData] = useState<DataItem[]>([]);

  const fetchData = async (add?: boolean) => {
    fetch(
      "https://api.nasa.gov/planetary/apod?api_key=gaff4Pwpu0Qg6woyFty1YhVRxhj4In1ImvOCyFD7&start_date=2022-10-01&end_date=2022-10-29&thumbs=true"
    )
      .then(async (res) => {
        const response = await res.json();
        console.log("Data fetched : ", response)
        if (add) {
          setData([...data, ...response])
        } else
          setData(response);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    fetchData(false).then().catch(console.error)
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <img
            className={styles.headerLogo}
            src="https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg"
          />
          <span>{"Bibhash Singh"}</span>
        </div>
        <div>Astronomy Picture of the Day</div>
      </div>

      {data.length > 0 && (
        <div className={styles.spotlight}>
          <div className={styles.spotlightData}>
            <span className={styles.spotlightTitle}>
              {data[data.length - 1].title}
            </span>
            <span className={styles.spotlightDescription}>
              {data[data.length - 1].explanation?.length > 100
                ? `${data[data.length - 1].explanation.substring(0, 100)}...`
                : data[data.length - 1].explanation}
            </span>
            <span className={styles.spotlightCopyright}>
              {data[data.length - 1].copyright}
            </span>
          </div>
          <MediaCard
            className={styles.mediaBanner}
            mediaUrl={data[data.length - 1].url}
            mediaType={data[data.length - 1].media_type as MediaType}
          />
        </div>
      )}

      <div className={styles.cardRows}>
        {data.map((item, index) => {
          return (
            <div className={styles.cardRowRoot} key={index}>
              <div className={styles.cardRowContainer}>
                {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                  <div key={index} className={styles.card}>
                    <div className={styles.cardMediaContainer}>
                      <MediaCard
                        mediaType={item.media_type as MediaType}
                        mediaUrl={item.url}
                        className={styles.cardMedia}
                        thumbnailUrl={item.thumbnail_url}
                      />
                    </div>
                    <div className={styles.cardData}>
                      <span className={styles.cardTitle}>{item.title}</span>
                      <span className={styles.cardDate}>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <Waypoint onEnter={(e) => {
        console.log("enter");
        fetchData(true).catch(console.error)
      }} ><div className={styles.infiniteScroll}> <h5>Loading Data !!!!</h5> </div></Waypoint>
    </div>
  );
};

export default Home;
