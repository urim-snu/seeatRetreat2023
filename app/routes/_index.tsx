import { ActionArgs, json, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useEffect } from "react";
import { logout, requireUser, requireUserId } from "~/session.server";

import { useOptionalUser } from "~/utils";
import { fetchAllCarpoolData } from "~/utils/carpool";
import { fetchAllPreSeedData } from "~/utils/preSeed";
import { fetchAllRiderData } from "~/utils/rider";
import { fetchAllSeedGroupData } from "~/utils/seedGroup";
import { fetchAllShuttleData } from "~/utils/shuttle";

export const meta: V2_MetaFunction = () => [
  { title: "2023 Seeat Retreat Admin" },
];

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUserId(request);
  return json({ user });
};

export const action = async ({ request }: ActionArgs) => {
  const user = await requireUser(request);
  const formData = await request.formData();
  const action = formData.get("action");

  switch (action) {
    case "fetchAllShuttle":
      return await fetchAllShuttleData();
    case "fetchAllRider":
      return await fetchAllRiderData();
    case "fetchAllCarpool":
      return await fetchAllCarpoolData();
    case "fetchAllSeedGroup":
      return await fetchAllSeedGroupData();
    case "fetchAllPreSeed":
      return await fetchAllPreSeedData();
    case "logout":
      return await logout(request);
  }

  return json({ message: "Unknown action" }, { status: 400 });
};

export default function Index() {
  const navigation = useNavigation();
  const actionData = useActionData();

  // in useEffect, check actionData.message and alert it
  useEffect(() => {
    if (actionData && actionData.message) {
      alert(actionData.message);
    }
  }, [actionData]);

  return (
    <main className="flex h-screen">
      <div className="m-auto flex grow flex-col items-center justify-center">
        <div className="text-4xl font-bold">2023 씨앗 수양회 Admin Page</div>

        {/* 셔틀 관리 */}
        <div className="mt-8 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold">셔틀 관리</h2>
          <div className="mt-4">
            <Form method="post">
              <input type="hidden" name="action" value="fetchAllShuttle" />
              <button
                type="submit"
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                셔틀 정보 전부 가져오기
              </button>
            </Form>
          </div>
        </div>

        {/* 수양관 라이더 관리 */}
        <div className="mt-8 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold">수양관 라이더 관리</h2>
          <div className="mt-4">
            <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
              수양관 라이더 정보 전부 가져오기
            </button>
          </div>
        </div>

        {/* 복귀 카풀 관리 */}
        <div className="mt-8 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold">복귀 카풀 관리</h2>
          <div className="mt-4">
            <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
              복귀 카풀 정보 전부 가져오기
            </button>
          </div>
        </div>

        {/* 씨앗모임 관리 */}
        <div className="mt-8 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold">참가자 관리</h2>
          <div className="mt-4">
            <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
              씨앗모임, 프리씨드, 숙소 정보 가져오기
            </button>
          </div>
        </div>

        {/* 로그아웃 */}
        <div className="mt-8 flex flex-col items-center justify-center">
          <div className="mt-4">
            <Form method="post">
              <input type="hidden" name="action" value="logout" />
              <button
                type="submit"
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                Logout
              </button>
            </Form>
          </div>
        </div>
      </div>
      {/* loading when submitting*/}
      {navigation.state !== "idle" && (
        <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50">
          <div className="text-4xl font-bold text-white">
            작업중... 창을 나가지 마세요.
          </div>
        </div>
      )}
    </main>
  );
}
