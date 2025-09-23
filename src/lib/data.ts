import { Plane, Smartphone, BookOpen, Ticket, Shirt } from 'lucide-react';
import type { Category, Wish } from './types';
import placeholderData from './placeholder-images.json';

export const categories: Category[] = [
  { id: 'travel', name: 'Travel', icon: Plane },
  { id: 'gadgets', name: 'Gadgets', icon: Smartphone },
  { id: 'books', name: 'Books', icon: BookOpen },
  { id: 'experiences', name: 'Experiences', icon: Ticket },
  { id: 'fashion', name: 'Fashion', icon: Shirt },
];

export const initialWishes: Wish[] = [
  {
    id: '1',
    description: 'I wish to go on a vacation to a beautiful tropical island and relax on the beach.',
    category: categories[0],
    createdAt: new Date('2023-10-26T10:00:00Z'),
    imageUrl: placeholderData.placeholderImages[0].imageUrl,
    imageHint: placeholderData.placeholderImages[0].imageHint,
    url: 'https://www.example.com/tropical-vacation'
  },
  {
    id: '2',
    description: 'I want the latest smartphone with a great camera.',
    category: categories[1],
    createdAt: new Date('2023-10-25T14:30:00Z'),
    imageUrl: placeholderData.placeholderImages[1].imageUrl,
    imageHint: placeholderData.placeholderImages[1].imageHint,
  },
  {
    id: '3',
    description: 'I wish I had more time to read all the books on my list.',
    category: categories[2],
    createdAt: new Date('2023-10-24T09:00:00Z'),
    imageUrl: placeholderData.placeholderImages[2].imageUrl,
    imageHint: placeholderData.placeholderImages[2].imageHint,
  },
  {
    id: '4',
    description: 'I would love to experience the thrill of paragliding over the mountains.',
    category: categories[3],
    createdAt: new Date('2023-10-23T18:45:00Z'),
    imageUrl: placeholderData.placeholderImages[3].imageUrl,
    imageHint: placeholderData.placeholderImages[3].imageHint,
  },
  {
    id: '5',
    description: 'A classic, stylish leather jacket to complete my wardrobe.',
    category: categories[4],
    createdAt: new Date('2023-10-22T12:00:00Z'),
    imageUrl: placeholderData.placeholderImages[4].imageUrl,
    imageHint: placeholderData.placeholderImages[4].imageHint,
    url: 'https://www.example.com/leather-jacket'
  },
];
