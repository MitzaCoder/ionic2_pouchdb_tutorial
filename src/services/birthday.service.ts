import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';

@Injectable()
export class BirthdayService {
    private db;
    private birthdays;

    public initDB() {
        this.db = new PouchDB('birthday2', { adapter: 'websql' });
    }

    public add(birthday) {
        /*
            Put the birthday in the database, put => auto generated _id.
        */
        return this.db.post(birthday);
    }

    public getAll() {
        if (!this.birthdays) {
            return this.db.allDocs({ include_docs: true})
                .then(docs => {
                    /*
                        Cache the birthdays data.
                    */
                    this.birthdays = docs.rows.map(row => {
                        /*
                            Convert date from string to Date.
                        */
                        row.doc.Date = new Date(row.doc.Date);
                        return row.doc;
                    });

                    this.db.changes({ live: true, since: 'now', include_docs: true })
                        .on('change', this.onDatabaseChange);

                    return this.birthdays;
                });
        } else {
            return Promise.resolve(this.birthdays);
        }
    }

    private onDatabaseChange(change) {
        const index = this.findIndex(this.birthdays, change.id);
        const birthday = this.birthdays[index];
        if (change.deleted) {
            if (birthday) {
                this.birthdays.splice(index, 1);
            }
        } else {
            change.doc.Date = new Date(change.doc.Date);
            if (birthday && birthday._id === change.id) {
                this.birthdays[index] = change.doc;
            } else {
                this.birthdays.splice(index, 0, change.doc);
            }
        }
    }

    private findIndex(array, id) {
        let low = 0, high = array.length, mid;
        while (low < high) {
            mid = (low + high) >>> 1;
            array[mid]._id < id ? low = mid + 1 : high = mid;
        }
        return low;
    }

    public update(birthday) {
        return this.db.put(birthday);
    }

    public delete(birthday) {
        return this.db.remove(birthday);
    }
}