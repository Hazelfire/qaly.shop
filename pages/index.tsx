import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import React from "react";
import { SquiggleChart } from "@quri/squiggle-components";

const data = [
  {
    name: "GiveDirectly",
    description: "Does shit",
    category: "Global Health and Development",
    effectiveness: "givedirectly.csv",
    url: "https://www.givedirectly.org/",
    report:
      "https://forum.effectivealtruism.org/posts/ycLhq4Bmep8ssr4wR/quantifying-uncertainty-in-givewell-s-givedirectly-cost",
    buyLink: "https://www.givingwhatwecan.org/",
  },
  {
    name: "Against Malaria Foundation",
    description: "Does shit",
    category: "Global Health and Development",
    effectiveness: "amf.csv",
    url: "https://www.againstmalaria.com/",
    report: "https://observablehq.com/d/a444c74425bdd968",
    buyLink: "https://www.givingwhatwecan.org/",
  },
];

export function PromiseLoader<T>({
  promise,
  children,
}: {
  promise: Promise<T>;
  children: (x: T) => React.ReactElement;
}): React.ReactElement {
  const [result, setResult] = useState<T | undefined>(undefined);
  useEffect(() => {
    promise.then((x: T) => setResult(x));
  }, [promise]);
  if (result === undefined) {
    return <div>Loading</div>;
  } else {
    return children(result);
  }
}

async function parseSquiggleExport(code: string) {
  let response = await fetch(`http://localhost:3000/squiggle_dists/${code}`);
  let responseText = await response.text();
  let samples = responseText.split("\n").splice(1);
  return `SampleSet.fromList([${samples.join(",")}])`;
}

export async function getStaticProps() {
  const charities = await Promise.all(
    data.map(async (x) => {
      const code = await parseSquiggleExport(x.effectiveness);
      return {
        ...x,
        effectiveness: code,
      };
    })
  );
  return {
    props: {
      charities,
    },
  };
}

export default function Home({ charities }: { charities: typeof data }) {
  return (
    <>
      <Head>
        <title>QALY.shop</title>
        <meta name="description" content="Your one-stop qaly shop" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <header>Purchase QALYs from different sources.</header>
        <ul>
          {charities.map((x) => (
            <li key={x.name}>
              <h2>
                <a href={x.url}>{x.name}</a>
              </h2>
              <p>{x.description}</p>
              <p>
                Effectiveness from <a href={x.report}>report</a>
              </p>
              <SquiggleChart code={x.effectiveness} />
              <a href={x.buyLink}>Buy Now</a>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
