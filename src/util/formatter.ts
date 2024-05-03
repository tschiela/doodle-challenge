import moment from 'moment';

export function formatDateTime(date) {
    return moment(date).format('DD.MM.YYYY, HH:mm');
}
