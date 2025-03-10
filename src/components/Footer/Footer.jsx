import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <p className="footer__credentials">Developed by Greg Jones</p>
      <p className="footer__date">{year}</p>
    </footer>
  );
}

export default Footer;
