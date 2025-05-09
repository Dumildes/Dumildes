/// <reference no-default-lib="true"/>
 

export default function Date({ date }) {
    return (
        <span>
            {date?.substring(0, 10).split('-').reverse().join('/')}
        </span>
    )
}