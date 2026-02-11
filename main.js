document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = "1"; // TheSportsDB Free API Key
    const eventsContainer = document.getElementById('events-container');
    const loadingIndicator = document.getElementById('events-loading');

    async function fetchBoxingEventsAndDisplay() {
        if (!eventsContainer || !loadingIndicator) {
            console.error("Events container or loading indicator not found.");
            return;
        }

        loadingIndicator.style.display = 'block'; // Show loading indicator
        eventsContainer.innerHTML = ''; // Clear previous content

        try {
            let events = [];

            // Attempt 1: search for events by sport name 'Boxing'
            let response = await fetch(`https://www.thesportsdb.com/api/v1/json/${API_KEY}/searchevents.php?s=Boxing`);
            let data = await response.json();
            if (data && data.event && data.event.length > 0) {
                // Filter out past events if any are returned by searchevents.php (it can return both)
                const now = new Date();
                events = data.event.filter(e => new Date(e.dateEvent + ' ' + e.strTime) > now);
            }

            // Attempt 2: If no upcoming events found, try to get league ID and then next events
            if (events.length === 0) {
                console.log("No upcoming events found via searchevents. Trying with league ID.");
                const allLeaguesUrl = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/all_leagues.php`;
                const leagueResponse = await fetch(allLeaguesUrl);
                const leagueData = await leagueResponse.json();
                
                let boxingLeagueId = null;
                if (leagueData && leagueData.leagues) {
                    const boxingLeague = leagueData.leagues.find(league => league.strSport.toLowerCase() === 'boxing');
                    if (boxingLeague) {
                        boxingLeagueId = boxingLeague.idLeague;
                    }
                }

                if (boxingLeagueId) {
                    const nextEventsUrl = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/eventsnextleague.php?id=${boxingLeagueId}`;
                    const nextEventsResponse = await fetch(nextEventsUrl);
                    const nextEventsData = await nextEventsResponse.json();

                    if (nextEventsData && nextEventsData.events) {
                        events = nextEventsData.events;
                    }
                }
            }


            if (events.length > 0) {
                events.forEach(event => {
                    const eventCard = document.createElement('div');
                    eventCard.classList.add('event-card');
                    
                    const eventTitle = event.strEvent || 'N/A';
                    const eventDate = event.dateEvent || 'N/A';
                    const eventTime = event.strTime || '';
                    const eventVenue = event.strVenue || 'N/A';
                    const eventCountry = event.strCountry || ''; // Not always available, but good to have
                    const eventThumb = event.strThumb || 'https://via.placeholder.com/200x150?text=Boxing+Event';

                    eventCard.innerHTML = `
                        <h3>${eventTitle}</h3>
                        <p><strong>날짜:</strong> ${eventDate} (시간: ${eventTime})</p>
                        <p><strong>장소:</strong> ${eventVenue} ${eventCountry ? `(${eventCountry})` : ''}</p>
                        <img src="${eventThumb}" alt="경기 포스터" style="width:100%; height:auto; margin-top:10px; border-radius:5px;">
                    `;
                    eventsContainer.appendChild(eventCard);
                });
            } else {
                eventsContainer.innerHTML = '<p>현재 예정된 복싱 이벤트가 없습니다.</p>';
            }

        } catch (error) {
            console.error("복싱 이벤트를 가져오는 중 오류 발생:", error);
            eventsContainer.innerHTML = '<p>이벤트 데이터를 가져오는 데 실패했습니다. 잠시 후 다시 시도해주세요.</p>';
        } finally {
            loadingIndicator.style.display = 'none'; // Hide loading indicator
        }
    }

    fetchBoxingEventsAndDisplay();
});
