import { Component } from "react";
import { Parallax } from 'react-parallax';
import "./OurStory.css";

import gatechImage from "../assets/OurStory/gatech.jpg";
import atlUnitedFans from "../assets/OurStory/Atlanta.png";
import ireland from "../assets/OurStory/ireland.jpg";
import toughMudder from "../assets/OurStory/toughMudder.png";
import alaska from '../assets/OurStory/alaska.jpg';
import engagement from "../assets/OurStory/engagement.jpg";
import separateKyle from "../assets/OurStory/kyleInChicago.png";
import separateSyneva from "../assets/OurStory/london.png";


export default class OurStory extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        return (
            <div className="ourStory">
                <h2 className="ourStory__title">Kyle and Syneva met at Georgia Tech</h2>

                <Parallax
                    bgImage={gatechImage}
                    bgImageAlt="Georgia Tech Football Stadium"
                    strength={40}
                >
                    <div
                        className="ourStory__hero"
                    />
                </Parallax>
                <p className="ourStory__content">
                Kyle and Syneva met at Georgia Tech and worked together at the Tech Rec bowling alley.  Despite going separate ways after college (Kyle to Chicago and Syneva to London), they kept in touch.
                </p>
                <div className="ourStory__separatePictures">
                    <Parallax
                        className="ourStory__hero--coffeeBagel"
                        bgImage={separateKyle}
                        bgImageAlt="separate"
                        strength={40}
                    >
                    <div
                            className="ourStory__hero ourStory__heroSeparate"
                        />
                    </Parallax>
                    <Parallax
                        className="ourStory__hero--coffeeBagel"
                        bgImage={separateSyneva}
                        bgImageAlt="separate"
                        strength={40}
                    >
                    <div
                            className="ourStory__hero ourStory__heroSeparate"
                        />
                    </Parallax>
                </div>
                <p className="ourStory__content">
                A memorable reunion took place in Ireland, where they cycled from Galway to Dublin before a Georgia Tech football game.
                </p>
                <Parallax
                    className="ourStory__hero--coffeeBagel"
                    bgImage={ireland}
                    bgImageAlt="Bicylcle Trip"
                    strength={40}
                >
                   <div
                        className="ourStory__hero"
                    />
                </Parallax>
                <p className="ourStory__content">A few years later, they both ended up back in Atlanta and started dating. </p>
                <Parallax
                    bgImage={atlUnitedFans}
                    bgImageAlt="Atl united fans"
                    strength={40}
                >
                    <div
                        className="ourStory__hero"
                    />
                </Parallax>
                <p className="ourStory__content">Throughout the years, Kyle and Syneva have supported each other through various milestones, including grad school and job changes.</p>
                <Parallax
                className="ourStory__hero--final"
                    bgImage={toughMudder}
                    bgImageAlt="tough mudder"
                    strength={40}
                >
                    <div
                        className="ourStory__hero"
                    />
                </Parallax>
                <p className="ourStory__content"> In 2022, they embarked on a new chapter, moving to Alaska. They've since embraced a life filled with adventure and are always looking for ways to have a positive impact on their community.</p>
                <Parallax
                className="ourStory__hero--final"
                    bgImage={alaska}
                    bgImageAlt="in alaska"
                    strength={40}
                >
                    <div
                        className="ourStory__hero"
                    />
                </Parallax>
                <p className="ourStory__content"> Kyle and Syneva are filled with excitement for the future. They are committed to continuing their growth together and uplifting each other, always striving to be the best versions of themselves.</p>
                <Parallax
                className="ourStory__hero--final"
                    bgImage={engagement}
                    bgImageAlt="engagement"
                    strength={40}
                >
                    <div
                        className="ourStory__hero"
                    />
                </Parallax>
            </div>
        );
    }
}