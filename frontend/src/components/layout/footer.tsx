export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AppPC — Xây dựng cấu hình PC theo ý bạn.
      </div>
    </footer>
  );
}
