import tent from "/icons/tent.svg";
import bonfire from "/icons/bonfire.svg";
import bag from "/icons/bag.svg";
import bikini from "/icons/bikini.svg" ;
import cafe from "/icons/cafe.svg";
import family from "/icons/family.svg";
import stroller from "/icons/stroller.svg";
import glutenfree from "/icons/gluten-free.svg";
// import photo1 from "/photos/photo.jpg" příprava na fotky


const data = [
    {
        id: 1,
        title: "Chatová osada Ostaš",
        lat: 49.8022514,
        lng: 15.6252330,
        tags: [
            family,
            tent,
            bonfire,
            cafe,
            bag,
           
        ],
        description: "Vrcholová plošina stolové hory Ostaš je ohraničená pískovcovými skalními stěnami a věžemi vysokými až 40 metrů. ",
        notes: [
            "Příště chatku 2 (u silnice) nebo 3.",
            "V kiosku lze zapůjčit sportovní náčiní (míče, petanque, ...)",
            "Nemají nic bezlepkového.",
        ] ,
        // photo: [photo1, photo2] příprava na fotky
    },
    {
        id: 2,
        title: "Muzeum skla Harrachov",
        lat: 50.7819779,
        lng: 15.41894,
        tags: [
            cafe,
            family,
        ],
        description: " Muzeum skla je součástí sklárny v Harrachově. Obsahuje historicky a technologicky ucelenou sbírku historického skla z produkce harrachovské sklárny.",
        notes: [
            "Lorem ipsum  dolor sit amet purus malesuada congue.",
            "Aliquam ornaterdum. Aliquam erat volutpat.",
            "Nemo enim ipsanatoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris dictum facilisis augue.",
            "Integer rutrum, orci vestibulum ullamcursus purus, vel sagittis velit mauris vel metus. Nullam at arcu a est sollicitudin euismod. Nunc tincidunt ante vitae massa. Nulla est.",
        ] ,        
    },
    {
        id: 3,
        title: "IQLandia",
        lat: 50.7610850,
        lng: 15.0530346,
        tags: [
            cafe, family, stroller
        ],
        description: "iQLANDIA je vhodná pro děti od 8 let a všechny dospělé. Exponáty jsou techničtější, popisy odbornější, doprovodné programy (workshopy, science show) vysvětlují jevy, o kterých už děti někdy slyšely ve škole.",
        notes: [
            "Lorem ipsum  dolor sit amet purus malesuada congue.",
            "Aliquam ornaterdum. Aliquam erat volutpat.",
            "Nemo enim ipsanatoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris dictum facilisis augue.",
            "Integer rutrum, orci vestibulum ullamcursus purus, vel sagittis velit mauris vel metus. Nullam at arcu a est sollicitudin euismod. Nunc tincidunt ante vitae massa. Nulla est.",
        ] ,        
    },

    {
        id: 4,
        title: "Prachovské skály",
        lat: 50.4673551,
        lng: 15.2932227,
        tags: [
            cafe, family,glutenfree,
        ],
        description: "Prachovské skály tvoří pískovcové skalní město. Díky otevřeným náhorním plošinám je zde nespočet vyhlídek, z nichž budete mít celý Český ráj jako na dlani.",
        notes: [
            "Lorem ipsum  dolor sit amet purus malesuada congue.",
            "Aliquam ornaterdum. Aliquam erat volutpat.",
            "Nemo enim ipsanatoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris dictum facilisis augue.",
            "Integer rutrum, orci vestibulum ullamcursus purus, vel sagittis velit mauris vel metus. Nullam at arcu a est sollicitudin euismod. Nunc tincidunt ante vitae massa. Nulla est.",
        ] ,        
    },
    {
        id: 5,
        title: "Teplické skály",
        lat: 50.5910880,
        lng: 16.1253494,
        tags: [cafe, family, bonfire,],
        description: "Teplické skalní město odděluje od toho Adršpašského 4 kilometry dlouhá Vlčí rokle. Teplické skály jsou rozsáhlejší částí Národní přírodní rezervace Adršpašsko-teplické skály. Jsou známé divokým skalním labyrintem, svými vysokými skalními útvary, rozsáhlými masivy a pohádkovou přírodou.",
        notes: [
            "Lorem ipsum  dolor sit amet purus malesuada congue.",
            "Aliquam ornaterdum. Aliquam erat volutpat.",
            "Nemo enim ipsanatoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris dictum facilisis augue.",
            "Integer rutrum, orci vestibulum ullamcursus purus, vel sagittis velit mauris vel metus. Nullam at arcu a est sollicitudin euismod. Nunc tincidunt ante vitae massa. Nulla est.",
        ] ,        
    },
    {
        id: 6,
        title: "Babiččino údolí",
        lat: 50.4264966,
        lng: 16.0458507,
        tags: [cafe, family, bonfire,stroller],
        description: "Babiččino údolí je turisticky navštěvováno zejména kvůli spisovatelce Boženě Němcové, která zde zasadila děj díla Babička Ale díky značně členitému terénu, který vytváří prostor pro pestrost květeny i výskyt mnoha zajímavých i vzácných živočichů, je i cennou přírodní lokalitou.",
        notes: [
            "Lorem ipsum  dolor sit amet purus malesuada congue.",
            "Aliquam ornaterdum. Aliquam erat volutpat.",
            "Nemo enim ipsanatoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris dictum facilisis augue.",
            "Integer rutrum, orci vestibulum ullamcursus purus, vel sagittis velit mauris vel metus. Nullam at arcu a est sollicitudin euismod. Nunc tincidunt ante vitae massa. Nulla est.",
        ] ,        
    }
    
]

export default data