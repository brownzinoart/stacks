/**
 * Events page - Book club meetups and library events
 * Features: Book club meetups, author talks, workshops, and community events
 */

'use client';

import { Navigation } from '@/components/navigation';

const mockEvents = [
  {
    id: 1,
    title: 'Mystery Book Club',
    type: 'book-club',
    date: '2024-08-15',
    time: '7:00 PM',
    location: 'Central Library - Reading Room',
    attendees: 23,
    maxAttendees: 30,
    book: 'The Silent Patient by Alex Michaelides',
    description: 'Join us for a thrilling discussion of psychological thrillers. This month we\'re diving into "The Silent Patient" - a novel that will keep you guessing until the very end.',
    host: 'Sarah Chen',
    isFeatured: true,
    tags: ['Mystery', 'Thriller', 'Discussion']
  },
  {
    id: 2,
    title: 'Sci-Fi & Fantasy Meetup',
    type: 'book-club',
    date: '2024-08-18',
    time: '6:30 PM',
    location: 'Westside Branch - Community Room',
    attendees: 18,
    maxAttendees: 25,
    book: 'Project Hail Mary by Andy Weir',
    description: 'Explore the cosmos with fellow sci-fi enthusiasts! We\'ll discuss "Project Hail Mary" and share our favorite space exploration stories.',
    host: 'Marcus Rodriguez',
    isFeatured: false,
    tags: ['Sci-Fi', 'Space', 'Adventure']
  },
  {
    id: 3,
    title: 'Author Talk: Local Writers',
    type: 'author-talk',
    date: '2024-08-20',
    time: '8:00 PM',
    location: 'Central Library - Auditorium',
    attendees: 45,
    maxAttendees: 100,
    book: 'Various Local Authors',
    description: 'Meet local authors and discover new voices in your community. Q&A session and book signing included.',
    host: 'Library Events Team',
    isFeatured: true,
    tags: ['Local Authors', 'Q&A', 'Book Signing']
  },
  {
    id: 4,
    title: 'Young Adult Book Club',
    type: 'book-club',
    date: '2024-08-22',
    time: '4:00 PM',
    location: 'Northside Branch - Teen Space',
    attendees: 12,
    maxAttendees: 20,
    book: 'The Inheritance Games by Jennifer Lynn Barnes',
    description: 'Perfect for teens and young adults! Join our monthly YA book club for lively discussions and new friendships.',
    host: 'Emma Thompson',
    isFeatured: false,
    tags: ['Young Adult', 'Teen', 'Friendship']
  },
  {
    id: 5,
    title: 'Poetry Night',
    type: 'workshop',
    date: '2024-08-25',
    time: '7:30 PM',
    location: 'Downtown Branch - Poetry Corner',
    attendees: 15,
    maxAttendees: 30,
    book: 'Open Mic & Featured Poets',
    description: 'Share your poetry or just listen to beautiful words. All skill levels welcome!',
    host: 'Poetry Collective',
    isFeatured: false,
    tags: ['Poetry', 'Open Mic', 'Creative']
  },
  {
    id: 6,
    title: 'Historical Fiction Club',
    type: 'book-club',
    date: '2024-08-28',
    time: '6:00 PM',
    location: 'Central Library - History Room',
    attendees: 28,
    maxAttendees: 35,
    book: 'The Paris Library by Janet Skeslien Charles',
    description: 'Travel through time with our historical fiction book club. This month we explore WWII Paris through literature.',
    host: 'Dr. James Wilson',
    isFeatured: true,
    tags: ['Historical Fiction', 'WWII', 'Paris']
  }
];

// Event Card Component
const EventCard = ({ event, isCompact = false }: { event: any; isCompact?: boolean }) => {
  const handleJoinEvent = (eventId: number) => {
    console.log('Joining event:', eventId);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'book-club': return 'bg-primary-green';
      case 'author-talk': return 'bg-primary-purple';
      case 'workshop': return 'bg-primary-orange';
      default: return 'bg-primary-blue';
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'book-club': return 'BOOK CLUB';
      case 'author-talk': return 'AUTHOR TALK';
      case 'workshop': return 'WORKSHOP';
      default: return 'EVENT';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 outline-bold-thin hover:scale-105 transition-transform duration-300">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-black text-white shadow-backdrop mb-3 ${getEventTypeColor(event.type)}`}>
              {getEventTypeText(event.type)}
            </div>
            <h3 className="font-black text-text-primary text-lg mb-2">{event.title}</h3>
            <p className="text-base text-text-primary font-bold">{event.description}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-base">
            <span className="text-text-primary font-bold">DATE</span>
            <span className="font-black text-text-primary">{formatDate(event.date)}</span>
          </div>
          
          <div className="flex justify-between text-base">
            <span className="text-text-primary font-bold">TIME</span>
            <span className="font-black text-text-primary">{event.time}</span>
          </div>
          
          {!isCompact && (
            <>
              <div className="flex justify-between text-base">
                <span className="text-text-primary font-bold">LOCATION</span>
                <span className="font-black text-text-primary">{event.location}</span>
              </div>
              
              <div className="flex justify-between text-base">
                <span className="text-text-primary font-bold">ATTENDEES</span>
                <span className="font-black text-text-primary">{event.attendees}/{event.maxAttendees}</span>
              </div>
              
              <div className="flex justify-between text-base">
                <span className="text-text-primary font-bold">HOST</span>
                <span className="font-black text-text-primary">{event.host}</span>
              </div>
            </>
          )}
          
          {isCompact && (
            <div className="flex justify-between text-base">
              <span className="text-text-primary font-bold">ATTENDEES</span>
              <span className="font-black text-text-primary">{event.attendees}/{event.maxAttendees}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {event.tags.slice(0, isCompact ? 2 : undefined).map((tag: string, index: number) => (
            <span key={index} className="px-3 py-1 bg-primary-yellow/20 text-text-primary text-xs font-bold rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <button
          onClick={() => handleJoinEvent(event.id)}
          className="w-full bg-primary-green text-text-primary font-black py-3 px-6 rounded-2xl hover:scale-105 transition-transform touch-feedback shadow-backdrop text-lg"
        >
          JOIN EVENT
        </button>
      </div>
    </div>
  );
};

// Featured Events Component
const FeaturedEvents = ({ events }: { events: any[] }) => {
  return (
    <div className="animate-fade-in-up animation-delay-200">
      <div className="bg-primary-orange rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgb(0,0,0,0.3)] relative overflow-hidden pop-element-lg">
        <div className="space-y-6 sm:space-y-8 relative z-10">
          <div>
            <h2 className="text-huge font-black text-text-primary leading-extra-tight mb-4 sm:mb-6">
              <span className="text-primary-yellow">FEATURED</span><br />
              <span className="text-mega">EVENTS</span>
            </h2>
            <p className="text-lg sm:text-xl text-text-primary font-bold mb-6">
              Don't miss these highlighted events happening soon!
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-6 left-6 w-16 h-16 sm:w-20 sm:h-20 bg-primary-yellow rounded-full opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float z-0" />
        <div className="absolute top-2 right-12 w-12 h-12 sm:w-16 sm:h-16 bg-primary-pink rounded-full opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-delayed z-0" />
        <div className="absolute bottom-6 right-6 w-8 h-8 sm:w-12 sm:h-12 bg-primary-teal rounded-full opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-slow z-0" />
        <div className="absolute bottom-12 left-4 w-10 h-10 sm:w-14 sm:h-14 bg-primary-orange rounded-full opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float z-0" />
        <div className="absolute top-12 right-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary-purple rounded-full opacity-45 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-delayed z-0" />
      </div>
    </div>
  );
};

// All Events Component
const AllEvents = ({ events }: { events: any[] }) => {
  return (
    <div className="animate-fade-in-up animation-delay-400">
      <div className="bg-primary-blue rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgb(0,0,0,0.3)] relative overflow-hidden pop-element-lg">
        <div className="space-y-6 sm:space-y-8 relative z-10">
          <div>
            <h2 className="text-huge font-black text-text-primary leading-extra-tight mb-4 sm:mb-6">
              <span className="text-primary-yellow">ALL</span><br />
              <span className="text-mega">EVENTS</span>
            </h2>
            <p className="text-lg sm:text-xl text-text-primary font-bold mb-6">
              Explore all upcoming events and find your perfect match!
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} isCompact={true} />
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-6 left-6 w-16 h-16 sm:w-20 sm:h-20 bg-primary-yellow rounded-full opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float z-0" />
        <div className="absolute top-2 right-12 w-12 h-12 sm:w-16 sm:h-16 bg-primary-pink rounded-full opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-delayed z-0" />
        <div className="absolute bottom-6 right-6 w-8 h-8 sm:w-12 sm:h-12 bg-primary-teal rounded-full opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-slow z-0" />
        <div className="absolute bottom-12 left-4 w-10 h-10 sm:w-14 sm:h-14 bg-primary-green rounded-full opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float z-0" />
        <div className="absolute top-12 right-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary-purple rounded-full opacity-45 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-delayed z-0" />
      </div>
    </div>
  );
};

const EventsPage = () => {
  const featuredEvents = mockEvents.filter(event => event.isFeatured);
  const regularEvents = mockEvents.filter(event => !event.isFeatured);

  return (
    <div className="flex h-full flex-col bg-bg-light">
      <Navigation />
      
      <main className="flex-1 overflow-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
          {/* Hero Section - Clean and Focused */}
          <div className="bg-primary-purple rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.3)] animate-fade-in-up pop-element-lg">
            <div className="relative z-10">
              <h1 className="text-huge font-black text-text-primary leading-extra-tight mb-4 sm:mb-6">
                <span className="text-primary-yellow">LIBRARY</span><br />
                <span className="text-mega">EVENTS</span>
              </h1>
              <p className="text-lg sm:text-xl text-text-primary mb-6 sm:mb-8 font-bold leading-tight">
                Join book clubs, meet authors, and connect<br />
                with fellow readers in your community!
              </p>
              
              {/* Primary Action */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 outline-bold-thin">
                <div className="text-center space-y-4">
                  <div className="text-4xl font-black text-text-primary">🎉</div>
                  <div className="text-lg font-black text-text-primary">Ready to join an event?</div>
                  <div className="text-base text-text-primary font-bold">Browse featured events below or explore all upcoming activities</div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-6 left-6 w-16 h-16 sm:w-20 sm:h-20 bg-primary-yellow rounded-full opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float z-0" />
            <div className="absolute top-2 right-12 w-12 h-12 sm:w-16 sm:h-16 bg-primary-pink rounded-full opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-delayed z-0" />
            <div className="absolute bottom-6 right-6 w-8 h-8 sm:w-12 sm:h-12 bg-primary-teal rounded-full opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-slow z-0" />
            <div className="absolute bottom-12 left-4 w-10 h-10 sm:w-14 sm:h-14 bg-primary-green rounded-full opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float z-0" />
            <div className="absolute top-12 right-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary-orange rounded-full opacity-45 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-delayed z-0" />
          </div>

          {/* Featured Events */}
          <FeaturedEvents events={featuredEvents} />

          {/* All Events */}
          <AllEvents events={regularEvents} />
        </div>
      </main>
    </div>
  );
};

export default EventsPage; 