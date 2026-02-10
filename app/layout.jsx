import './globals.css';

export const metadata = {
  title: 'United We Spend — Your Money Has Power. Use It.',
  description: 'The economy isn\'t broken. It was designed to work for corporations, not people. We built a tool to change that.',
  openGraph: {
    title: 'United We Spend — Your Money Has Power. Use It.',
    description: 'Search local and union businesses. Keep your money where you live.',
    url: 'https://unitedwespend.app',
    siteName: 'United We Spend',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'United We Spend — Your Money Has Power. Use It.',
    description: 'Search local and union businesses. Keep your money where you live.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
