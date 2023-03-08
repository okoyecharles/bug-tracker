import React, { useMemo, useEffect, useState } from "react";
import { AiFillClockCircle } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import Pluralize from "react-pluralize";
import getDate from "../../../utils/strings/date";
import { Ticket } from "../../../types/models";
import {
  getTicketPriority,
  getTicketStatus,
} from "../../../utils/strings/class";
import { BsThreeDots } from "react-icons/bs";
import TicketOptionsPopup from "./Options";
import { useSelector } from "react-redux";
import { storeType } from "../../../../redux/configureStore";
import ImageRow from "../../../components/ImageRow";
import Authorized from "../../../utils/authorization";
import { a } from "@react-spring/web";
import { Tooltip } from "react-tooltip";

interface TicketRowProps {
  ticket: Ticket | undefined;
  ticketDetails: Ticket | null;
  showTicketDetails: any;
  setTicketDetails: any;
  ticketRowTrail: any;
}

const TicketRow: React.FC<TicketRowProps> = ({
  ticket,
  ticketDetails,
  showTicketDetails,
  setTicketDetails,
  ticketRowTrail,
}) => {
  const user = useSelector((store: storeType) => store.currentUser.user);
  const project = useSelector((store: storeType) => store.project.project);
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Set ticket details if the ticket id matches the ticket details id
    if (ticket?._id === ticketDetails?._id) setTicketDetails(ticket);
  }, [ticket]);

  const isInProjectTeam = useMemo(() => {
    return Authorized("project", "team", user, project);
  }, [project, user?._id]);

  return (
    <a.li
      className="ticket-row min-h-[70px] grid gap-2 grid-cols-6 lg:grid-cols-16 xl:grid-cols-15 border-b border-gray-600 hover:bg-gray-850 transition-colors group relative cursor-pointer"
      onClick={() => {
        setTicketDetails(ticket);
        showTicketDetails(true);
      }}
      style={ticketRowTrail}
    >
      <header className="flex flex-col gap-1 lg:col-span-4 px-1 pl-4 select-none justify-center">
        <h3
          className="font-semibold font-noto text-gray-100 truncate"
          id={`ticket-title-${ticket?._id}`}
        >
          {ticket?.title}
        </h3>
        <Tooltip
          anchorId={`ticket-title-${ticket?._id}`}
          content={ticket?.title}
          delayShow={1000}
        />
        <div className="flex gap-4">
          <span className="text-gray-200 text-sm font-semibold flex items-center gap-1">
            <FaCommentAlt className="text-base text-orange-500/80" />
            {ticket?.comments.length}
          </span>
          <span className="text-gray-200 text-sm font-semibold flex items-center gap-1">
            <AiFillClockCircle className="text-base text-orange-500/80" />
            <Pluralize singular="hr" count={ticket?.time_estimate} />
          </span>
        </div>
      </header>
      <div className="flex items-center px-1 lg:col-span-2">
        <button
          className={`${getTicketPriority(
            ticket?.priority
          )} capitalize rounded p-2 py-1 text-center w-24 font-semibold text-sm xl:text-ss font-noto focus:ring-4 transition-all`}
        >
          {ticket?.priority}
        </button>
      </div>
      <div className="flex items-center px-1 lg:col-span-2">
        <button
          className={`${getTicketStatus(
            ticket?.status
          )} capitalize rounded p-2 py-1 text-center w-24 font-semibold text-sm xl:text-ss font-noto focus:ring-4 transition-all`}
        >
          {ticket?.status}
        </button>
      </div>
      <div className="flex items-center px-1 lg:col-span-2">
        <span className="capitalize text-sm xl:text-ss text-orange-400 font-semibold font-noto">
          {ticket?.type}
        </span>
      </div>
      <div className="flex items-center px-1 lg:col-span-2">
        <span className="text-sm xl:text-ss text-gray-200 font-noto">
          {getDate(ticket?.createdAt, { format: "L" })}
        </span>
      </div>
      <div className="flex items-center justify-between pl-1 lg:col-span-4 xl:col-span-3">
        <ImageRow
          model={ticket!}
          maxImages={3}
          continueText=" "
          emptyText="No team"
        />
        {
          // Show options button if user is a project member
          isInProjectTeam ? (
            <button
              className="p-1 pr-4 items-center justify-center transition hidden lg:flex"
              onClick={(e) => {
                e.stopPropagation();
                setOptionsOpen(!optionsOpen);
              }}
            >
              <BsThreeDots className="text-lg text-white opacity-0 group-hover:opacity-100" />
            </button>
          ) : null
        }
      </div>
      <TicketOptionsPopup
        open={optionsOpen}
        setOpen={setOptionsOpen}
        ticket={ticket!}
      />
    </a.li>
  );
};

export default TicketRow;
