'use client'
import { useIntl } from 'react-intl'
import ScheduleTable, {
    ActivityProps,
} from '@/components/ScheduleTable/ScheduleTable'
import clsx from 'clsx'
import styles from '@/app/(main)/events/[id]/styles.module.css'
import React from 'react'

type ScheduleProps = {
    activities: ActivityProps[]
}

export function Schedule(props: ScheduleProps) {
    const intl = useIntl()

    const activityByDateTimeAndZone = React.useMemo(
        () =>
            props.activities.reduce(
                (result, activity) => {
                    const date = intl.formatDate(activity.start_date, {
                        day: '2-digit',
                        month: '2-digit',
                    })

                    if (!result[date]) {
                        result[date] = {}
                    }

                    const time = intl.formatDate(activity.start_date, {
                        hour: '2-digit',
                        minute: '2-digit',
                    })

                    if (!result[date][activity.zone]) {
                        result[date][activity.zone] = {}
                    }

                    if (!result[date][activity.zone][time]) {
                        result[date][activity.zone][time] = []
                    }

                    result[date][activity.zone][time].push(activity)

                    return result
                },
                {} as {
                    [key: string]: {
                        [key: string]: { [key: string]: ActivityProps[] }
                    }
                }
            ),
        [props.activities, intl]
    )

    const dates = React.useMemo(
        () => Object.keys(activityByDateTimeAndZone),
        [activityByDateTimeAndZone]
    ).sort()
    const [currentDate, setCurrentDate] = React.useState(dates[0])

    if (props.activities.length === 0) {
        return null
    }

    return (
        <section className="section">
            <h2 className="section__title">Расписание</h2>
            <div className="section__action">
                {dates.length > 1 &&
                    dates.map((date, index) => (
                        <button
                            key={index}
                            type="button"
                            className={clsx(styles.eventScheduleDate, {
                                [styles.eventScheduleDate_active]:
                                    currentDate === date,
                            })}
                            onClick={(event) => {
                                event.preventDefault()
                                setCurrentDate(date)
                            }}
                        >
                            {date}
                        </button>
                    ))}
            </div>
            <div
                className={clsx(
                    'section__content',
                    styles.eventScheduleTable__wrapper
                )}
            >
                <ScheduleTable
                    className={styles.eventScheduleTable}
                    activitiesByZoneAndTime={
                        activityByDateTimeAndZone[currentDate]
                    }
                />
            </div>
        </section>
    )
}
