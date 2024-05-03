import './Message.scss'
import { formatDateTime } from '../util/formatter.ts'
import { type Message } from '../types/Message.ts';

function Message({type, username, userId, text, date}: Message) {
    return (
        <>
            <div className={'message message--' + type}>
                {type === 'incoming' && <img className="message__image" src={`/user${userId}.jpg`} />}
                <div className="message__content">
                    <div className="message__content__user">{username}:</div>
                    <div className="message__content__text">{text}</div>
                    <div className="message__content__date">{formatDateTime(date)}</div>
                </div>
            </div>
        </>
    )
}

export default Message
