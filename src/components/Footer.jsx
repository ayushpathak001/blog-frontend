export default function Footer() {
  return (
    <footer className="mt-16 border-t border-blue-100 bg-white py-8 pb-24 text-center text-sm text-slate-500 md:pb-8">
      © {new Date().getFullYear()} My Blog · Write. Share. Inspire.
    </footer>
  );
}
