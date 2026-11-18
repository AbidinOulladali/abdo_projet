import styles from '../styles/acceuil.module.css'

export default function Acceuil() {
  return (
    <aside className={styles.sidebar}>
      <h2>Catégories</h2>
      <ul>
        <li><a href="#claviers">Claviers</a></li>
        <li><a href="#souris">Souris</a></li>
        <li><a href="#ecrans">Écrans</a></li>
      </ul>
    </aside>
  )
}