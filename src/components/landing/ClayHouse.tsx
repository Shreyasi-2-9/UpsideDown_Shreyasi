import { Icon } from "../common/Icon";

export function ClayHouse() {
  return (
    <div className="house-scene" aria-label="A warm house with service tools">
      <div className="sun-orb" />
      <div className="clay-house">
        <div className="roof" />
        <div className="chimney" />
        <div className="house-body">
          <div className="window" />
          <div className="door" />
        </div>
      </div>
      <div className="tool-orb tool-left" title="Appliance & repair tools">
        <Icon name="settings" size={30} />
      </div>
      <div className="tool-orb tool-right" title="Painting & maintenance tools">
        <Icon name="paint" size={28} />
      </div>
      <div className="ground-shadow" />
    </div>
  );
}
