export interface EventsRoot {
  _embedded: Embedded
  _links: Links4
  page: Page
}

export interface Embedded {
  events: Event[]
}

export interface Event {
  name: string
  type: string
  id: string
  test: boolean
  url: string
  locale: string
  images: Image[]
  sales: Sales
  dates: Dates
  classifications: Classification[]
  promoter?: Promoter
  promoters?: Promoter2[]
  products?: Product[]
  seatmap: Seatmap
  accessibility?: Accessibility
  ticketLimit?: TicketLimit
  ageRestrictions?: AgeRestrictions
  ticketing: Ticketing
  nameOrigin: string
  _links: Links
  _embedded: Embedded2
  info?: string
  pleaseNote?: string
  outlets?: Outlet[]
}

export interface Image {
  ratio?: string
  url: string
  width: number
  height: number
  fallback: boolean
}

export interface Sales {
  public: Public
  presales?: Presale[]
}

export interface Public {
  startDateTime: string
  startTBD: boolean
  startTBA: boolean
  endDateTime: string
}

export interface Presale {
  startDateTime: string
  endDateTime: string
  name: string
}

export interface Dates {
  start: Start
  timezone?: string
  status: Status
  spanMultipleDays: boolean
}

export interface Start {
  localDate: string
  localTime: string
  dateTime: string
  dateTBD: boolean
  dateTBA: boolean
  timeTBA: boolean
  noSpecificTime: boolean
}

export interface Status {
  code: string
}

export interface Classification {
  primary: boolean
  segment: Segment
  genre: Genre
  subGenre: SubGenre
  type?: Type
  subType?: SubType
  family: boolean
}

export interface Segment {
  id: string
  name: string
}

export interface Genre {
  id: string
  name: string
}

export interface SubGenre {
  id: string
  name: string
}

export interface Type {
  id: string
  name: string
}

export interface SubType {
  id: string
  name: string
}

export interface Promoter {
  id: string
  name: string
  description: string
}

export interface Promoter2 {
  id: string
  name: string
  description: string
}

export interface Product {
  name: string
  id: string
  url: string
  type: string
  classifications: Classification2[]
}

export interface Classification2 {
  primary: boolean
  segment: Segment2
  genre: Genre2
  subGenre: SubGenre2
  type: Type2
  subType: SubType2
  family: boolean
}

export interface Segment2 {
  id: string
  name: string
}

export interface Genre2 {
  id: string
  name: string
}

export interface SubGenre2 {
  id: string
  name: string
}

export interface Type2 {
  id: string
  name: string
}

export interface SubType2 {
  id: string
  name: string
}

export interface Seatmap {
  staticUrl: string
}

export interface Accessibility {
  info?: string
  ticketLimit: number
}

export interface TicketLimit {
  info: string
}

export interface AgeRestrictions {
  legalAgeEnforced: boolean
}

export interface Ticketing {
  safeTix?: SafeTix
  allInclusivePricing: AllInclusivePricing
}

export interface SafeTix {
  enabled: boolean
}

export interface AllInclusivePricing {
  enabled: boolean
}

export interface Links {
  self: Self
  attractions: Attraction[]
  venues: Venue[]
}

export interface Self {
  href: string
}

export interface Attraction {
  href: string
}

export interface Venue {
  href: string
}

export interface Embedded2 {
  venues: Venue2[]
  attractions: Attraction2[]
}

export interface Venue2 {
  name: string
  type: string
  id: string
  test: boolean
  url?: string
  locale: string
  images?: Image2[]
  postalCode: string
  timezone: string
  city: City
  state: State
  country: Country
  address: Address
  location: Location
  markets?: Market[]
  dmas: Dma[]
  boxOfficeInfo?: BoxOfficeInfo
  parkingDetail?: string
  accessibleSeatingDetail?: string
  generalInfo?: GeneralInfo
  upcomingEvents: UpcomingEvents
  _links: Links2
  aliases?: string[]
  social?: Social
  ada?: Ada
}

export interface Image2 {
  ratio: string
  url: string
  width: number
  height: number
  fallback: boolean
}

export interface City {
  name: string
}

export interface State {
  name: string
  stateCode: string
}

export interface Country {
  name: string
  countryCode: string
}

export interface Address {
  line1: string
}

export interface Location {
  longitude: string
  latitude: string
}

export interface Market {
  name: string
  id: string
}

export interface Dma {
  id: number
}

export interface BoxOfficeInfo {
  phoneNumberDetail?: string
  openHoursDetail: string
  acceptedPaymentDetail?: string
  willCallDetail?: string
}

export interface GeneralInfo {
  generalRule?: string
  childRule: string
}

export interface UpcomingEvents {
  archtics?: number
  ticketmaster: number
  _total: number
  _filtered: number
  tmr?: number
}

export interface Links2 {
  self: Self2
}

export interface Self2 {
  href: string
}

export interface Social {
  twitter: Twitter
}

export interface Twitter {
  handle: string
}

export interface Ada {
  adaPhones: string
  adaCustomCopy: string
  adaHours: string
}

export interface Attraction2 {
  name: string
  type: string
  id: string
  test: boolean
  url: string
  locale: string
  externalLinks: ExternalLinks
  aliases?: string[]
  images: Image3[]
  classifications: Classification3[]
  upcomingEvents: UpcomingEvents2
  _links: Links3
}

export interface ExternalLinks {
  twitter: Twitter2[]
  wiki: Wiki[]
  facebook: Facebook[]
  instagram: Instagram[]
  homepage: Homepage[]
}

export interface Twitter2 {
  url: string
}

export interface Wiki {
  url: string
}

export interface Facebook {
  url: string
}

export interface Instagram {
  url: string
}

export interface Homepage {
  url: string
}

export interface Image3 {
  ratio?: string
  url: string
  width: number
  height: number
  fallback: boolean
}

export interface Classification3 {
  primary: boolean
  segment: Segment3
  genre: Genre3
  subGenre: SubGenre3
  type: Type3
  subType: SubType3
  family: boolean
}

export interface Segment3 {
  id: string
  name: string
}

export interface Genre3 {
  id: string
  name: string
}

export interface SubGenre3 {
  id: string
  name: string
}

export interface Type3 {
  id: string
  name: string
}

export interface SubType3 {
  id: string
  name: string
}

export interface UpcomingEvents2 {
  tmr: number
  ticketmaster: number
  _total: number
  _filtered: number
}

export interface Links3 {
  self: Self3
}

export interface Self3 {
  href: string
}

export interface Outlet {
  url: string
  type: string
}

export interface Links4 {
  first: First
  self: Self4
  next: Next
  last: Last
}

export interface First {
  href: string
}

export interface Self4 {
  href: string
}

export interface Next {
  href: string
}

export interface Last {
  href: string
}

export interface Page {
  size: number
  totalElements: number
  totalPages: number
  number: number
}
