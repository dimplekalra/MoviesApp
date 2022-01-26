import React, { useContext, useEffect, useRef, useState } from "react";
import M, { Openable } from "materialize-css";
import { auth } from "../../../common/utility";
import { removeUser } from "../../../common/api/user";
import Modal from "../../../controls/Modal";
import { RouteProps, useNavigate } from "react-router-dom";
import stateContext, { ContextProps } from "../../../context/state-context";

interface IProps extends RouteProps {
  userId: string;
}

const DeleteUser: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const [modalInstance, setModalInstance] = useState<Openable | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const context = useContext(stateContext) as ContextProps;

  const history = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated()) history("/signin");

    if (modalRef.current) {
      setModalInstance(M.Modal.init(modalRef.current));
    }
  }, []);

  const clickButton = (): void => {
    if (modalInstance) {
      modalInstance.open();
    }
  };

  const deleteAccount = async (): Promise<void> => {
    try {
      const jwt = auth.isAuthenticated();

      if (!jwt) history("/signin");

      context.setAPIState({
        InProgress: true,
        Failed: false,
        FailMessage: "",
      });

      const result = await removeUser(
        props.userId,

        { t: jwt.accessToken, r: jwt.refreshToken }
      );

      if (result.error) {
        throw new Error(result.error);
      }

      if (result) {
        await auth.signOut(() => console.log("signed out"));
        history("/signin");
        context.setAPIState({
          ...context.APIStatus,
          InProgress: false,
          Failed: false,
        });

        history("/signin");
      }
    } catch (error: any) {
      context.setAPIState({
        ...context.APIStatus,
        InProgress: false,
        Failed: true,
        FailMessage: error.message,
      });
    }
  };

  const handleRequestClose = (): void => {
    if (modalInstance) modalInstance.close();
  };

  const { APIStatus } = context;
  return (
    <span>
      <button
        className="btn-floating center red waves-effect waves-light"
        disabled={APIStatus.InProgress}
      >
        <i className="material-icons" onClick={clickButton}>
          delete
        </i>
      </button>

      <Modal
        ref={modalRef}
        onCancel={handleRequestClose}
        onConfirm={deleteAccount}
        title="Delete Account"
      >
        <p>Confirm to delete your account.</p>
      </Modal>
    </span>
  );
};

export default DeleteUser;
