import { Coffee } from "@phosphor-icons/react/dist/ssr";
import "./ArticleSupportCallToAction.scss";

const ArticleSupportCallToAction = () => {
  return (
    <div className="article-support-call-to-action-container">
      <div className="article-support-call-to-action-icon">
        <Coffee size={54} weight="fill" />
      </div>

      <div className="article-support-call-to-action-content">
        <h3>Pomaže li ti naš blog?</h3>

        <p>
          Naši vodiči, savjeti i informacije ostaju besplatni za sve. Ako ti je
          ovaj članak pomogao u planiranju putovanja, možeš nas podržati
          simboličnom kavom i pomoći nam u održavanju bloga.
        </p>

        <a
          href="https://www.buymeacoffee.com/putujemstravem"
          target="_blank"
          rel="noopener noreferrer"
          className="article-support-call-to-action-button"
        >
          ☕ Podrži blog
        </a>
      </div>
    </div>
  );
};

export default ArticleSupportCallToAction;