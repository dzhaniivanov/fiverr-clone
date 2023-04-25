import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Messages.scss";
import moment from "moment";
const Messages = () => {
  const queryClient = useQueryClient();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => newRequest(`/conversations`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/conversationS/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const handleRead = (id) => {
    mutation.mutate(id);
  };

  return (
    <div className="messages">
      {isLoading ? (
        "Loading..."
      ) : error ? (
        "Something went wrong..."
      ) : (
        <div className="container">
          <div className="title">
            <h1>Messages</h1>
          </div>
          <table>
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Last Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((conversation) => (
                <tr
                  className={
                    ((currentUser.isSeller && conversation.readBySeller) ||
                      (!currentUser.isSeller && !conversation.readByBuyer)) &&
                    "active"
                  }
                  key={conversation.id}
                >
                  <td>
                    {currentUser.isSeller
                      ? conversation.buyerId
                      : conversation.sellerId}
                  </td>
                  <td>
                    <Link to={`/message/${conversation.id}`} className="link">
                      {conversation?.lastMessage?.substring(0, 100)}...
                    </Link>
                  </td>
                  <td>{moment(conversation.updatedAt).fromNow()}</td>
                  <td>
                    {(currentUser.isSeller && conversation.readBySeller) ||
                      (!currentUser.isSeller && !conversation.readByBuyer && (
                        <button onClick={() => handleRead(conversation.id)}>
                          Mark as Read
                        </button>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default Messages;
