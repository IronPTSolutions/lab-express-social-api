// PageLayout centraliza el contenido máximo ancho y el padding horizontal/vertical.
// Todos los pages lo usan como wrapper para mantener consistencia visual.
function PageLayout({ children }) {
  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      {children}
    </main>
  );
}

export default PageLayout;
