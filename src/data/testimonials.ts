export interface Testimonial {
  name: string;
  source: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Rina',
    source: 'Google',
    rating: 5,
    quote: 'Sop buah kuah alpukatnya kental, buahnya banyak. Harga segini sudah puas.',
  },
  {
    name: 'Dimas',
    source: 'GoFood',
    rating: 5,
    quote: 'Pesan lewat WA cepat dibalas. Jus mangga Yakult-nya pas manisnya.',
  },
  {
    name: 'Siti',
    source: 'Google',
    rating: 4,
    quote: 'Jus alpukatnya tidak encer. Tempatnya sederhana tapi bersih.',
  },
];
