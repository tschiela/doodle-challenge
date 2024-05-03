export interface Message {
    date: String;
    text: String;
    username: String;
    userId: String;
    type: 'outgoing' | 'incoming'
}
