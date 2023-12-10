import { useEffect, useState } from "react";
import "./MeetingsContainer.css";
import { CurrentUser, Meeting } from "types";
import { AcceptedMeetings } from "Components/AcceptedMeetings/AcceptedMeetings";
import { MeetingRequests } from "Components/MeetingRequests/MeetingRequests";
import { getMeetingsByUser } from "apiCalls";

interface MeetingsProps {
  meetings: Meeting[];
  currentUser: CurrentUser; 
}

function MeetingsContainer({ meetings, currentUser }: MeetingsProps) {
  const [isAccepted, setIsAccepted] = useState<boolean>(true);
  const [fetchedMeetings, setFetchedMeetings] = useState<Meeting[]>(meetings);
 
  const fetchMeetings = () => {
    getMeetingsByUser(currentUser.id)
      .then((meetingsData) => {
        const updatedMeetings = meetingsData.data;
        setFetchedMeetings(updatedMeetings);
      })
      .catch((error) => {
        console.error("Error fetching meetings:", error);
      });
  };

  useEffect(() => {
    fetchMeetings();
  }, [isAccepted, currentUser.id]);

  const meetingText = (bool: Boolean) =>
    bool ? "My Meetings" : "My Meeting Requests";

  const MeetingComponent = () =>
    !!isAccepted ? (
      <AcceptedMeetings meetings={fetchedMeetings} />
    ) : (
      <MeetingRequests meetings={fetchedMeetings} onMeetingsUpdate={fetchMeetings} />
    );

  const handleClick = () => setIsAccepted(!isAccepted);

  return (
    <div className="meetings-container">
      <div className="meetings-container-top">
        <h2 className="meetings-title">{meetingText(isAccepted)}</h2>
        <button
          className="meetings-toggle meeting-card-btn"
          onClick={handleClick}
        >
          {meetingText(!isAccepted)}
        </button>
      </div>

      {!!meetings.length ? (
        <MeetingComponent />
      ) : (
        <h2>No meetings yet, add meetings!</h2>
      )}
    </div>
  );
}

export default MeetingsContainer;
