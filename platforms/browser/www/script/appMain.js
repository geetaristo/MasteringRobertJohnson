
const rjimages = [
  'images/stylin.jpg',
  'images/smokin.jpg',
  'images/found.jpg'
]

const rjimagesOriginal = [
  'https://i.pinimg.com/originals/39/03/d5/3903d53bd0bda118ce92309d9adba186.jpg',
  'https://img.wennermedia.com/920-width/rs-136434-8a916d8793261a9fd3987708a76a80069f00692b.jpg',
  'https://upload.wikimedia.org/wikipedia/sl/0/01/Robert_Johnson.jpg'
]

const app = new Vue({
  el: '#app',
  data: {
    rjsongs,
    rjlyrics,
    rjimages,
    showMenu: false,
    sort: '',
    selectedLyrics: '',
    showLyrics: false,
    lastMenuAction: new Date()
  },
  computed: {
    allAreClosed () {
     return !this.rjsongs.filter( s => s.expanded ).length
    }
  },
  methods: {
    initializeSongs(songs) {
       if( songs.length === 29 ) {
         return songs.map(song => {
           return {
             title: song.title,
             played: 0,
             favorite: false,
             dates: [],
             expanded: false
           }
         })
       }
       throw new Error('What the...? This ain\'t no Robert Johnson song list.', songs.length)
    },
     played ( title ) {
        const song = this.rjsongs.find( s => s.title === title )
        song.played += 1
        song.dates.push( new Date().toISOString() )
        localStorage.rjsongs = JSON.stringify(this.rjsongs)
     },
     favoritize ( title ) {
        const song = this.rjsongs.find( s => s.title === title )
        if(!song.favorite)
          song.favorite = true
        else song.favorite = false

        localStorage.rjsongs = JSON.stringify(this.rjsongs)
     },
     mostRecentDetails (song) {
       const details = []
       if (song.played <=0 ) return 'Never played.'
       const md = new Date(mostRecent(song))
       const ft = new Date(firstTime(song))
       if (md){
         details.push('Last played ' + [md.getFullYear(), md.getMonth() + 1, md.getDate()].join('-'))
       }
       if (song.played === 1) return details.join('<br />')
       if (ft){
         details.push('First played ' + [md.getFullYear(), md.getMonth() + 1, md.getDate()].join('-'))
       }

       return details.join('<br />')
     },
     mostRecent (song) {
       if (song.played <=0 ) return 'Never played.'
       const md = new Date(maxDate([...song.dates]))
       console.log(md)
       if (md)
       return [md.getFullYear(), md.getMonth() + 1, md.getDate()].join('-')
     },
     unplayed ( title ) {
        const song = this.rjsongs.find( s => s.title === title )
        song.played -= 1
        song.dates.pop()
        localStorage.rjsongs = JSON.stringify(this.rjsongs)
     },
     toggleSong (title) {
       const song = this.rjsongs.find( s => s.title == title )
       song.expanded = !song.expanded
     },
     classForSong(title) {
       const song = this.rjsongs.find( s => s.title == title )
       if (song.played >= 50 ) {
          return 'virtuoso'
       } else if (song.played >= 20 ) {
          return 'mastered'
       } else if (song.played > 10 ) {
          return 'realGood'
       } else if (song.played > 5) {
          return 'prettyGood'
       } else if (song.played > 0) {
          return 'started'
       }
       return 'neverPlayed'
     },
     expandMenu ( ) {
       this.showMenu = !this.showMenu
     },
     delayedMenuClose () {
       const self = this
       this.lastMenuAction = new Date()
       // this is close to workign right, but... fuck it.
       // if the menu has been idle for more than 4 seconds close it
       setTimeout( () => {
         const idleSeconds = Math.floor((new Date() - this.lastMenuAction) / 100) / 10;
         if(idleSeconds >= 1.5){
           self.showMenu = false
         }
       }, 1500)
     },
     sortTitle (delayedClose = true) {
       const titleSortUp = (a, b) => {
         if (a.title > b.title) return 1
         else if(a.title < b.title) return -1
         else return 0
       }
       const titleSortDown = (a, b) => {
         if (a.title > b.title) return -1
         else if(a.title < b.title) return 1
         else return 0
       }

       let titleSorter = titleSortUp
       if (this.sort === 'titleUp') {
         this.sort = 'titleDown'
         titleSorter = titleSortDown
       }else {
         this.sort = 'titleUp'
       }
       this.rjsongs = this.rjsongs.sort(titleSorter)
       if (delayedClose) {
         this.delayedMenuClose()
       }
     },
     sortTimesPlayed () {
       const playedSorterDown = (a, b) => {
         if (a.played > b.played) return 1
         else if(a.played < b.played) return -1
         else return 0
       }

       const playedSorterUp = (a, b) => {
         if (a.played > b.played) return -1
         else if(a.played < b.played) return 1
         else return 0
       }

       let playedSorter = playedSorterUp
       if (this.sort === 'playedUp') {
         this.sort = 'playedDown'
         playedSorter = playedSorterDown
       } else if (this.sort === 'playedDown') {
         this.sort = 'playedUp'
       } else {
         this.sort = 'playedUp'
       }
       this.rjsongs = this.rjsongs.sort(playedSorter)
       this.delayedMenuClose()
     },
     sortByFavorites (delayedClose = true) {
       const favoriteSortUp = (a, b) => {
         if (a.favorite == b.favorite) { // both are favorited, so sort by title
           if (a.title > b.title) return 1
           else if(a.title < b.title) return -1
           else return 0
         } else if(a.favorite === true){
           return -1
         }
         return 1
       }

       const favoriteSortDown = (a, b) => {
         if (a.favorite == b.favorite) {
           if (a.title > b.title) return -1
           else if(a.title < b.title) return 1
           else return 0
         } else if(a.favorite === true){
           return 1
         }
         return -1
       }

       let favoriteSorter = favoriteSortUp
       if (this.sort === 'favoriteUp') {
         this.sort = 'favoriteDown'
         favoriteSorter = favoriteSortDown
       }else {
         this.sort = 'favoriteUp'
       }
       this.rjsongs = this.rjsongs.sort(favoriteSorter)
       if(delayedClose)
        this.delayedMenuClose()
     },
     sortDatePlayed () {

        const datesSorterDown = (a, b) => {
         if (mostRecent(a) > mostRecent(b)) return 1
         else if(mostRecent(a) < mostRecent(b)) return -1
         else return 0
        }

        const datesSorterUp = (a, b) => {
         if (mostRecent(a) > mostRecent(b)) return -1
         else if(mostRecent(a) < mostRecent(b)) return 1
         else return 0
        }

        let datesSorter = datesSorterUp
        if (this.sort === 'dateUp') {
         this.sort = 'dateDown'
         console.log('setting datePlayedDownSorter')
         datesSorter = datesSorterDown
       } else if (this.sort === 'dateDown') {
         this.sort = 'dateUp'
        } else {
         this.sort = 'dateUp'
        }
        this.rjsongs = this.rjsongs.sort(datesSorter)
        this.delayedMenuClose()
     },
     sortFieldValue(song) {
       let fields = this.$data.sort.match(/[a-z]+/)
       if (!fields) return
       let field = fields[0]
       if(field === 'date') {
         if(song.dates.length < 1) return ''
         return '<br />' + timeSince(new Date(mostRecent(song)))
       }
       if(field === 'played') {
         // this presently is the number of times played
         if(song[field] === 0) return '<br /> never played'
         return '<br /> played ' + song[field] + ' times'
       }
       return ''
     },
     expandSongs () {
       if ( this.allAreClosed ){
         this.expandAll()
       } else {
         this.closeAll()
       }

       this.delayedMenuClose()
     },
     closeAll () {
       this.rjsongs.map( s => s.expanded = false )
     },
     expandAll () {
      this.rjsongs.map( s => s.expanded = true )
    },
    selectLyrics (title) {
      if (this.rjlyrics[title]) {
        console.log('showing lyrics for ', title)
        this.selectedTitle = title
        this.selectedLyrics = this.rjlyrics[title]
        this.showLyrics = true;
        window.scrollTo(0, 0)
      } else {
        console.log('can\'t show lyrics for ', title)
        this.selectedTitle = ''
        this.selectedLyrics = ''
      }
    }
  },
  created () {
    if ( typeof(Storage) !== 'undefined' ) {
      const storedSongs = localStorage.getItem('rjsongs')
      if (storedSongs) {
        this.$data.rjsongs = JSON.parse(storedSongs)
        this.closeAll()
      } else {
        this.$data.rjsongs = this.initializeSongs(this.$data.rjsongs)
      }

      if (this.$data.rjsongs.find(s => s.favorite)){
        this.sortByFavorites(false)
      } else {
        this.sortTitle(false)
      }

    }
  }
})
