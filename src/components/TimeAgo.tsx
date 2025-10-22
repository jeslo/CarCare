import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import moment from 'moment';

// ✅ Optional: Customize moment text for better readability
moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'Just now',
    ss: 'Just now',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    w: 'a week',
    ww: '%d weeks',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
});

type TimeAgoProps = {
  time: string | Date | number; // Accepts ISO string, Date object, or timestamp
  style?: any;
  live?: boolean; // If true, updates automatically every minute
};

const TimeAgo: React.FC<TimeAgoProps> = ({ time, style, live = true }) => {
  const [display, setDisplay] = useState(moment(time).fromNow());

  useEffect(() => {
    if (!live) return;

    const interval = setInterval(() => {
      setDisplay(moment(time).fromNow());
    }, 60000); // update every 1 min

    return () => clearInterval(interval);
  }, [time, live]);

  return <Text style={style}>{display}</Text>;
};

export default TimeAgo;
