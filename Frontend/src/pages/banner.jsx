import { Link } from 'react-router-dom'
import styles from '../styles/banner.module.css'

export default function Banner() {
  return (
    <header className={styles.banner}>
      <h1>Ma boutique</h1>
      <nav>
        <Link to="/">Accueil</Link>
        <Link to="/">Produits</Link>
        <Link to="/">Contact</Link>
        <Link to="/login">Login</Link>
        <Link to="/inscription">Inscription</Link>
      </nav>
    </header>
  )
}