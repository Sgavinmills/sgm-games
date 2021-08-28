import styles from './CSS-sub-component/Filters.module.css'
import { useState } from 'react';

export default function Filters({ setFilters, categories}) {
    const [showFilterContainer, setShowFilterContainer] = useState(false);
    
    return (
        <div>
            <div className={styles["filter-button"]} onClick={() => { setShowFilterContainer(curr => !curr) }}>
                <i className="fas fa-filter"></i>
            </div>
               {showFilterContainer && <div className={styles['filter-container']}>
                <form>
                    <select onChange={event => {
                        setFilters(currFilter => {
                            const newFilter = { ...currFilter };
                            newFilter.category = categories.some(cat => cat.slug === event.target.value) ? event.target.value : null;
                            return newFilter;
                        })
                    }}>
                        <option value={null}>Category: all</option>
                        {categories.map(category => {
                            return <option value={category.slug} key={category.slug} >{category.slug}</option>
                        })}
                    </select>
                    <select onChange={event => {
                        setFilters(currFilter => {
                            const newFilter = { ...currFilter };
                            switch (event.target.value) {
                                case 'none':
                                    newFilter.sort_by = null;
                                    newFilter.order = null;
                                    break;
                                case 'owner-a-z':
                                    newFilter.sort_by = 'owner';
                                    newFilter.order = 'asc';
                                    break;
                                case 'owner-z-a':
                                    newFilter.sort_by = 'owner';
                                    newFilter.order = 'desc';
                                    break;
                                case 'title-a-z':
                                    newFilter.sort_by = 'title';
                                    newFilter.order = 'asc';
                                    break;
                                case 'title-z-a':
                                    newFilter.sort_by = 'title';
                                    newFilter.order = 'desc';
                                    break;
                                case 'category':
                                    newFilter.sort_by = 'category';
                                    newFilter.order = 'asc';
                                    break;
                                case 'comments-high':
                                    newFilter.sort_by = 'comment_count';
                                    newFilter.order = 'desc';
                                    break;
                                case 'comments-low':
                                    newFilter.sort_by = 'comment_count';
                                    newFilter.order = 'asc';
                                    break;
                                case 'votes-low':
                                    newFilter.sort_by = 'votes';
                                    newFilter.order = 'asc';
                                    break;
                                case 'votes-high':
                                    newFilter.sort_by = 'votes';
                                    newFilter.order = 'desc';
                                    break;
                                case 'date-new':
                                    newFilter.sort_by = 'created_at';
                                    newFilter.order = 'desc';
                                    break;
                                case 'date-old':
                                    newFilter.sort_by = 'created_at';
                                    newFilter.order = 'asc';
                                    break;
                            }
                            newFilter.p = 1;
                            return newFilter;
                        })
                    }}>
                        <option value="none">Sort By: none</option>
                        <option value='owner-a-z'>Reviewed by (A-Z)</option>
                        <option value='owner-z-a'>Reviewed by (Z-A) </option>
                        <option value="title-a-z">Title (A-Z)</option>
                        <option value="title-z-a">Title (Z-A)</option>
                        <option value="category">Category</option>
                        <option value="comments-high">Comments (high - low)</option>
                        <option value="comments-low">Comments (low - high)</option>
                        <option value="votes-high">Votes (high - low)</option>
                        <option value="votes-low">Votes (low- high)</option>
                        <option value="date-new">Date reviewed - Newest first</option>
                        <option value="date-old">Date reviewed - Oldest first</option>

                    </select>
                    <select onChange={event => setFilters(currFilters => {
                        const newFilters = { ...currFilters };
                        const tmpArr = event.target.value.split(' ');
                        newFilters[tmpArr[1]] = tmpArr[0];
                        if (tmpArr[1] === 'minutes') {
                            newFilters.hours = null;
                            newFilters.days = null;
                            newFilters.months = null;
                        } else if (tmpArr[1] === 'hours') {
                            newFilters.minutes = null;
                            newFilters.days = null;
                            newFilters.months = null;
                        } else if (tmpArr[1] === 'days') {
                            newFilters.minutes = null;
                            newFilters.hours = null;
                            newFilters.months = null;
                        } if (tmpArr[1] === 'months') {
                            newFilters.minutes = null;
                            newFilters.hours = null;
                            newFilters.days = null;
                        } if (tmpArr[1] === 'time') {
                            newFilters.minutes = null;
                            newFilters.hours = null;
                            newFilters.days = null;
                            newFilters.months = null
                        }
                        console.log(newFilters);
                        return newFilters;
                    })}>
                        <option value="all time">Reviews from last: All time</option>
                        <option value="1 minutes">Reviews from last: 1 minute</option>
                        <option value="10 minutes">Reviews from last: 10 minutes</option>
                        <option value="30 minutes">Reviews from last: 30 minutes</option>
                        <option value="1 hours">Reviews from last: 1 hour</option>
                        <option value="6 hours">Reviews from last: 6 hours</option>
                        <option value="12 hours">Reviews from last: 12 hours</option>
                        <option value="24 hours">Reviews from last: 24 hours</option>
                        <option value="3 days">Reviews from last: 3 days</option>
                        <option value="7 days">Reviews from last: 1 week</option>
                        <option value="14 days">Reviews from last: 2 weeks</option>
                        <option value="1 months">Reviews from last: 1 month</option>
                        <option value="3 months">Reviews from last: 3 months</option>
                        <option value="6 months">Reviews from last: 6 months</option>
                        <option value="12 months">Reviews from last: 1 year</option>
                        <option value="36 months">Reviews from last: 3 years</option>
                        <option value="60 months">Reviews from last: 5 years</option>
                    </select>
                </form>
            </div>}

        </div>
    )
}
