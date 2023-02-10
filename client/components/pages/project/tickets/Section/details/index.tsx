import React, { useContext, useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import store, { storeType } from "../../../../../../redux/configureStore";
import {
  commentOnTicket,
  fetchTicketById,
  socketCommentOnTicket,
  updateTicket,
} from "../../../../../../redux/actions/ticketActions";
import { useSelector } from "react-redux";
import { TailSpinLoader, ThreeDotsLoader } from "../../../../../loader";
import { restrictLength } from "../../../../../../utils/stringHelper";
import Pluralize from "react-pluralize";
import TicketComments from "./comments";
import { Ticket } from "../../../../../../types/models";
import getDate from "../../../../../../utils/dateHelper";
import TicketDeleteModal from "../../Modals/ticketDelete";
import SocketContext from "../../../../../context/SocketContext";

interface TicketDetailsBarProps {
  ticket: Ticket | null;
  open: boolean;
  setOpen: any;
}

const TicketDetailsBar: React.FC<TicketDetailsBarProps> = ({
  open,
  setOpen,
  ticket,
}) => {
  const currentUser = useSelector((store: storeType) => store.currentUser);
  const ticketDetails = useSelector((store: storeType) => store.ticket);

  const [showAllDescription, setShowAllDescription] = useState(false);
  const [projectDeleteModalOpen, setProjectDeleteModalOpen] = useState(false);

  const [comment, setComment] = useState("");
  const commentsRef = useRef(null);

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket?.emit("join-ticket-room", {
      userId: currentUser.user!._id,
      ticketId: ticket?._id,
    });
  }, [ticket?._id])

  useEffect(() => {
    if (!ticketDetails.loading && !ticketDetails.ticket) {
      setOpen(false);
    }
  }, [ticketDetails.ticket])

  useEffect(() => {
    async function refetchTicketDetails(ticket: Ticket) {
      store.dispatch(fetchTicketById(ticket._id));
    }

    if (ticket) refetchTicketDetails(ticket);
  }, [ticket?._id]);

  useEffect(() => {
    const commentSection = commentsRef?.current as HTMLDivElement | null;
    if (commentSection) {
      // Scroll to bottom of comments section
      commentSection.scrollTop = commentSection.scrollHeight;
    }
  }, [ticketDetails.ticket?.comments]);

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (comment.trim() && !ticketDetails.method.comment) {
      const ticket = ticketDetails.ticket!;
      store.dispatch(commentOnTicket(ticket._id, comment, socket));
      setComment("");
    }
  };

  return (
    <aside
      className={`bg-gray-850 fixed top-16 w-screen right-0 bottom-[58px] border-gray-700 lg:absolute lg:top-0 lg:w-72 lg:h-full lg:border-l ${
        open ? "translate-x-0" : "translate-x-full"
      } transition-all`}
    >
      <div className="relative flex flex-col h-full">
        <header className="flex p-3 gap-2 border-b border-gray-700">
          <div className="flex-1 flex flex-col gap-1">
            <h2 className="font-semibold text-gray-100 text-lg">
              {ticket?.title}
            </h2>
            <span
              className={`uppercase text-xsm py-1 px-2 font-bold ring-1 rounded-sm h-fit w-fit ${
                ticket?.status === "open"
                  ? "ring-blue-500 text-blue-500"
                  : "ring-red-500 text-red-500"
              }`}
            >
              {ticket?.status}
            </span>
            <p className="text-sm text-gray-500 font-semibold">
              <span>{`Created ${getDate(ticket?.createdAt, {
                format: "on calendar",
              })}`}</span>
            </p>
          </div>
          <div>
            <button
              name="close modal"
              className="text-3xl lg:text-xl text-white lg:text-gray-500 lg:hover:text-gray-200 transition h-6 w-6 flex items-center justify-center"
              onClick={() => {
                setOpen(false);
              }}
            >
              <IoMdClose />
            </button>
          </div>
        </header>

        {ticketDetails.loading && ticketDetails.method.details ? (
          <div className="p-3 aspect-square grid place-items-center">
            <div className="flex flex-col items-center gap-2">
              {" "}
              <TailSpinLoader color="orange" width={50} height={50} />
              <p className="text-ss">Loading details...</p>{" "}
            </div>
          </div>
        ) : (
          <div className="text-ss text-gray-100 flex-1 flex flex-col">
            <div className="ticket-content p-3 border-b border-gray-700">
              {/* Time estimate */}
              <h3 className="font-semibold text-sm text-gray-300 mb-4">
                <span className="uppercase text-orange-400">
                  Time estimated
                </span>
                :{" "}
                <Pluralize
                  singular="hour"
                  count={ticketDetails.ticket?.time_estimate}
                />
              </h3>

              {/* Description */}
              <h3 className="font-semibold text-sm text-gray-400">
                Description
              </h3>
              <p>
                {showAllDescription
                  ? ticketDetails.ticket?.description
                  : restrictLength(ticketDetails.ticket?.description, 200)}
                {(ticketDetails.ticket?.description?.length || 0) > 200 && (
                  <button
                    className="text-orange-400 ml-1"
                    onClick={() => {
                      setShowAllDescription(!showAllDescription);
                    }}
                  >
                    {showAllDescription ? "less" : "more"}
                  </button>
                )}
              </p>
            </div>

            <div className="ticket-comments flex flex-col gap-2 flex-1 mb-[62px] relative isolate">
              <header className="h-12 px-3 flex items-center bg-gray-900 z-50">
                <h3 className="font-semibold">Comments</h3>
              </header>
              <div className="absolute top-12 left-0 w-full bottom-0 z-10">
                <div
                  className="comments-container relative flex flex-col h-full overflow-y-scroll"
                  ref={commentsRef}
                >
                  <TicketComments
                    comments={ticketDetails.ticket?.comments || []}
                  />
                </div>
                <form onSubmit={handleCommentSubmit}>
                  <input
                    className="absolute bottom-2 w-[calc(100%-1.5rem)] left-3 rounded-sm bg-gray-900 outline-none px-3 py-2 shadow-sm text-sm text-white font-medium placeholder:text-gray-300 font-noto"
                    type="text"
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                    placeholder="Comment here"
                  />
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="buttons p-3 absolute bottom-0 left-0 w-full border-t border-gray-700 flex gap-2 bg-gray-825">
          <button
            className="bg-blue-500 flex justify-center p-2 text-ss font-semibold rounded text-blue-50 hover:bg-blue-600 disabled:opacity-75 disabled:cursor-not-allowed transition-colors flex-1"
            disabled={
              ticketDetails.loading ||
              ticketDetails.method.update ||
              ticketDetails.ticket?.status === "closed"
            }
            onClick={() => {
              store.dispatch(
                updateTicket(ticketDetails.ticket?._id!, {
                  status: "closed",
                })
              );
            }}
          >
            {ticketDetails.loading && ticketDetails.method.update ? (
              <ThreeDotsLoader />
            ) : (
              "Close Ticket"
            )}
          </button>
          <button
            className={`bg-red-500 justify-center p-2 text-ss font-semibold rounded text-blue-50 hover:bg-red-600 disabled:opacity-75 disabled:cursor-not-allowed transition-colors flex-1 ${
              ticketDetails.ticket?.author._id !== currentUser.user?._id
                ? "hidden"
                : "flex"
            }`}
            disabled={ticketDetails.loading || ticketDetails.method.delete}
            onClick={() => {
              setProjectDeleteModalOpen(true);
            }}
          >
            {ticketDetails.loading && ticketDetails.method.delete ? (
              <ThreeDotsLoader />
            ) : (
              "Delete Ticket"
            )}
          </button>
        </div>
      </div>
      {ticketDetails.ticket && (
        <TicketDeleteModal
          open={projectDeleteModalOpen}
          setOpen={setProjectDeleteModalOpen}
          ticket={ticketDetails.ticket!}
          loading={ticketDetails.loading}
          method={ticketDetails.method}
          socket={socket}
        />
      )}
    </aside>
  );
};

export default TicketDetailsBar;
