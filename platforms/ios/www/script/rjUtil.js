const timeSince = (date) => {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

const maxDate = (array) => {
  if (array.length === 0 ) return new Date(0).toISOString()

  if (array.length === 1 ) return array[0]

  if (array.length === 2 ) {
    if (array[0] > array[1]) return array[0]
    return array[1]
  }

  const first = array.pop()
  const second = array.pop()
  return maxDate( [first > second ? first : second, ...array] )
}

const minDate = (array) => {
  if (array.length === 0 ) return new Date(0).toISOString()

  if (array.length === 1 ) return array[0]

  if (array.length === 2 ) {
    if (array[0] < array[1]) return array[0]
    return array[1]
  }

  const first = array.pop()
  const second = array.pop()
  return maxDate( [first < second ? first : second, ...array] )
}

const firstTime = (song) => minDate([...song.dates])
const mostRecent = (song) => maxDate([...song.dates])
