import style from './styles.module.scss';

export function SubscribeButton() {
  return (
    <button
      type="button"
      className={style.subscribeButton}
    >
      Subscribe now
    </button>
  );
}
