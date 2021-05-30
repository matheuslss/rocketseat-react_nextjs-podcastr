import { GetStaticProps } from "next";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { api } from "../services/api";
import { convertDurationToTimeString } from "../utils/format/string";

type File = {
  url: string;
  duration: string;
};

type Episode = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  url: string;
  file: File;
};

type HomeProps = {
  episodes: Episode[];
};

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes = data.map((episode: Episode): Episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      published_at: format(parseISO(episode.published_at), "d MM yy", {
        locale: ptBR,
      }),
      file: {
        url: episode.file.url,
        duration: convertDurationToTimeString(Number(episode.file.duration)),
      },
      description: episode.description,
      url: episode.file.url,
    };
  });

  return {
    props: {
      episodes: episodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
