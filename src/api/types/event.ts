export interface EventRoot {
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
  promoter: Promoter
  promoters: Promoter2[]
  pleaseNote: string
  info?: string
  products: Product[]
  seatmap: Seatmap
  ticketLimit: TicketLimit
  ageRestrictions: AgeRestrictions
  ticketing: Ticketing
  nameOrigin: string
  _links: Links
  _embedded: Embedded
}

export interface Image {
  ratio: string
  url: string
  width: number
  height: number
  fallback: boolean
}

export interface Sales {
  public: Public
  presales: Presale[]
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
  timezone: string
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
  type: Type
  subType: SubType
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

export interface TicketLimit {
  info: string
}

export interface AgeRestrictions {
  legalAgeEnforced: boolean
}

export interface Ticketing {
  safeTix: SafeTix
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

export interface Embedded {
  venues: Venue2[]
  attractions: Attraction2[]
}

export interface Venue2 {
  name: string
  type: string
  id: string
  test: boolean
  url: string
  locale: string
  images: Image2[]
  postalCode: string
  timezone: string
  city: City
  country: Country
  address: Address
  location: Location
  markets: Market[]
  dmas: Dma[]
  social: Social
  boxOfficeInfo: BoxOfficeInfo
  parkingDetail: string
  accessibleSeatingDetail: string
  generalInfo: GeneralInfo
  upcomingEvents: UpcomingEvents
  ada: Ada
  _links: Links2
  state: {
    stateCode: string
    name: string
  }
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

export interface Country {
  name: string
  countryCode: string
}

export interface Address {
  line1: string
  line2: string
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

export interface Social {
  twitter: Twitter
}

export interface Twitter {
  handle: string
}

export interface BoxOfficeInfo {
  phoneNumberDetail: string
  acceptedPaymentDetail: string
}

export interface GeneralInfo {
  generalRule: string
  childRule: string
}

export interface UpcomingEvents {
  archtics: number
  ticketmaster: number
  _total: number
  _filtered: number
}

export interface Ada {
  adaPhones: string
  adaCustomCopy: string
  adaHours: string
}

export interface Links2 {
  self: Self2
}

export interface Self2 {
  href: string
}

export interface Attraction2 {
  name: string
  type: string
  id: string
  test: boolean
  url: string
  locale: string
  images: Image3[]
  classifications: Classification3[]
  upcomingEvents: UpcomingEvents2
  _links: Links3
}

export interface Image3 {
  ratio: string
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
